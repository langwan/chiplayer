package main

import (
	"backend/helper"
	"context"
	"errors"
	"fmt"
	"github.com/langwan/langgo/components/sqlite"
	"github.com/langwan/langgo/helpers/os"
	"github.com/langwan/langgo/helpers/platform"
	"github.com/ncruces/zenity"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"os"
	"path"
	"path/filepath"
	"sort"
	"strings"
)

type BackendService struct {
}

func (b BackendService) TaskList(ctx context.Context, empty *Empty) (tasks []TaskModel, err error) {
	res := sqlite.Get().Find(&tasks)
	if res.RowsAffected > 0 {
		return tasks, nil
	}
	return tasks, res.Error
}

type AssetListItem struct {
	Name    string `json:"name"`
	ModTime int64  `json:"mod_time"`
	Cover   string `json:"cover"`
	Path    string `json:"path"`
}

type AssetListResponse struct {
	Assets []*AssetListItem `json:"assets"`
}

func (b BackendService) AssetList(ctx context.Context, empty *Empty) (*AssetListResponse, error) {
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	files, err := os.ReadDir(dataPath)
	if err != nil {
		return nil, err
	}
	response := AssetListResponse{}
	var assetNames []string
	for _, file := range files {
		if file.Name() == ".DS_Store" {
			continue
		}
		info, err := file.Info()
		if err != nil {
			continue
		}

		response.Assets = append(response.Assets, &AssetListItem{
			Name:    file.Name(),
			ModTime: info.ModTime().UnixNano(),
			Path:    filepath.Join(dataPath, file.Name()),
		})

		assetNames = append(assetNames, file.Name())
	}

	var models []*AssetModel
	res := sqlite.Get().Find(&models, "name in ?", assetNames)
	if res.RowsAffected > 0 {
		for _, model := range models {
			for _, asset := range response.Assets {
				if asset.Name == model.Name {
					asset.Cover = model.Cover

					break
				}
			}
		}
	}

	return &response, nil
}

type AssetItemListRequest struct {
	AssetName string `json:"asset_name"`
}

type AssetItemListItem struct {
	Name      string `json:"name"`
	IsFolder  bool   `json:"is_folder"`
	FileSize  int64  `json:"file_size"`
	ModTime   int64  `json:"mod_time"`
	PlayerUri string `json:"player_uri"`
	Path      string `json:"path"`
	AssetName string `json:"asset_name"`
}

type AssetItemListResponse struct {
	Items []*AssetItemListItem `json:"items"`
}

func (b BackendService) AssetItemList(ctx context.Context, request *AssetItemListRequest) (*AssetItemListResponse, error) {
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	assetPath := filepath.Join(dataPath, request.AssetName)
	files, err := helper_os.ReadDir(assetPath, true)
	if err != nil {
		return nil, err
	}
	response := AssetItemListResponse{}

	for _, file := range files {
		info, err := file.Info()
		if err != nil {
			continue
		}
		response.Items = append(response.Items, &AssetItemListItem{
			Name:      file.Name(),
			IsFolder:  file.IsDir(),
			FileSize:  info.Size(),
			ModTime:   info.ModTime().UnixNano(),
			PlayerUri: path.Join("/player", request.AssetName, file.Name()),
			Path:      filepath.Join(assetPath, file.Name()),
			AssetName: request.AssetName,
		})
	}

	sort.Slice(response.Items, func(i, j int) bool {
		return response.Items[i].ModTime > response.Items[j].ModTime
	})

	return &response, nil
}

type FileAddRequest struct {
	AssetName string `json:"asset_name"`
}

func (b BackendService) FileAdd(ctx context.Context, request *FileAddRequest) (*Empty, error) {

	files, err := zenity.SelectFileMultiple(
		zenity.FileFilters{
			{"选择导入的视频文件", []string{"*.*"}},
		})
	if err != nil {
		return nil, err
	}
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())

	for _, f := range files {
		if !helper_os.FileExists(f) {
			continue
		}
		filename := filepath.Base(f)
		dst := filepath.Join(dataPath, request.AssetName, filename)
		task := TaskModel{
			AssetName:     request.AssetName,
			Name:          filename,
			LocalPath:     f,
			DstPath:       dst,
			TotalBytes:    0,
			ConsumedBytes: 0,
			IsCompleted:   false,
			Error:         "",
		}
		err := TaskAdd(&task)
		if err != nil {
			continue
		}
		go RequestStart(&task)
	}

	return &Empty{}, nil
}

type AssetAddRequest struct {
	AssetName string `json:"asset_name"`
}

type Empty struct {
}

func (b BackendService) AssetAdd(ctx context.Context, request *AssetAddRequest) (*Empty, error) {
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	assetPath := filepath.Join(dataPath, request.AssetName)
	if helper_os.FileExists(assetPath) {
		return &Empty{}, status.Error(codes.AlreadyExists, "资料夹已经存在")
	}
	err := helper_os.CreateFolder(assetPath, false)
	if err != nil {
		return &Empty{}, status.Error(codes.Aborted, err.Error())
	}
	PushMessageAssets()
	return &Empty{}, nil
}

type HelloResponse struct {
	Message string `json:"message"`
}

func (b BackendService) Hello(ctx context.Context, empty *Empty) (*HelloResponse, error) {
	return &HelloResponse{Message: "hello"}, nil
}

type OpenDataFileRequest struct {
	Path string `json:"path"`
}

func (b BackendService) OpenDataFile(ctx context.Context, request *OpenDataFileRequest) (*Empty, error) {
	helper_platform.OpenFileExplorer(request.Path)
	return &Empty{}, nil
}

func (b BackendService) EraserTaskAll(ctx context.Context, empty *Empty) (*Empty, error) {
	var tasks []TaskModel
	sqlite.Get().Where("1 = 1").Unscoped().Delete(&tasks)
	go PushMessageTasks()
	return &Empty{}, nil
}

type EraserRequest struct {
	Ids []string `json:"ids"`
}

func (b BackendService) EraserTasks(ctx context.Context, request *EraserRequest) (*Empty, error) {
	var tasks []TaskModel
	sqlite.Get().Unscoped().Delete(&tasks, "id in ?", request.Ids)
	go PushMessageTasks()
	return &Empty{}, nil
}

type RemoveFileRequest struct {
	AssetName string   `json:"asset_name"`
	Uris      []string `json:"uris"`
}

func (b BackendService) RemoveFile(ctx context.Context, request *RemoveFileRequest) (*Empty, error) {
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	assetPath := filepath.Join(dataPath, request.AssetName)
	if !helper_os.FileExists(assetPath) {
		return &Empty{}, status.Error(codes.AlreadyExists, "资料夹不存在")
	}
	for _, uri := range request.Uris {
		filename := filepath.Join(assetPath, uri)
		os.Remove(filename)
	}
	PushMessageVideos()
	return &Empty{}, nil
}

type RemoveAssetRequest struct {
	AssetNames []string `json:"asset_names"`
}

func (b BackendService) RemoveAsset(ctx context.Context, request *RemoveAssetRequest) (*Empty, error) {
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	for _, assetName := range request.AssetNames {
		assetPath := filepath.Join(dataPath, assetName)
		os.Remove(assetPath)
	}
	return &Empty{}, nil
}

type AssetRenameRequest struct {
	Name    string `json:"name"`
	NewName string `json:"new_name"`
}

func (b BackendService) AssetRename(ctx context.Context, request *AssetRenameRequest) (*Empty, error) {
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	assetPath := filepath.Join(dataPath, request.Name)
	newAssetPath := filepath.Join(dataPath, request.NewName)
	os.Rename(assetPath, newAssetPath)
	return &Empty{}, nil
}

type FileRenameRequest struct {
	AssetName string `json:"asset_name"`
	Name      string `json:"name"`
	NewName   string `json:"new_name"`
}

func (b BackendService) FileRename(ctx context.Context, request *FileRenameRequest) (*Empty, error) {
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	assetPath := filepath.Join(dataPath, request.AssetName)
	filePath := filepath.Join(assetPath, request.Name)
	ext := filepath.Ext(filePath)
	newName := fileNameWithoutExtTrimSuffix(request.NewName)
	fileNewPath := filepath.Join(assetPath, newName+ext)
	err := os.Rename(filePath, fileNewPath)
	msg := fmt.Sprint(err)
	if err != nil {
		return &Empty{}, errors.New(msg)
	}
	return &Empty{}, nil
}

func fileNameWithoutExtTrimSuffix(fileName string) string {
	return strings.TrimSuffix(fileName, filepath.Ext(fileName))
}
