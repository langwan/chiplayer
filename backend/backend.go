package main

import (
	"backend/app"
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
	"strconv"
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
					player := path.Join("/player", asset.Name, model.Cover)
					asset.Cover = player

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

type AssetSetCoverRequest struct {
	AssetName string `json:"asset_name"`
	Cover     string `json:"cover"`
}

func (b BackendService) AssetSetCover(ctx context.Context, request *AssetSetCoverRequest) (*Empty, error) {

	asset := AssetModel{
		Name:  request.AssetName,
		Cover: request.Cover,
	}

	res := sqlite.Get().First(&AssetModel{}, "name=?", request.AssetName)

	if res.RowsAffected == 0 {
		sqlite.Get().Create(&asset)
	} else {
		sqlite.Get().Model(&AssetModel{}).Where("name=?", request.AssetName).Update("cover", request.Cover)
	}

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
	sqlite.Get().Model(&AssetModel{}).Where("name=?", request.Name).Update("name", request.NewName)
	PushMessageAssets()
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
	newName := helper_os.FileNameWithoutExt(request.NewName)
	fileNewPath := filepath.Join(assetPath, newName+ext)
	err := os.Rename(filePath, fileNewPath)
	msg := fmt.Sprint(err)
	if err != nil {
		return &Empty{}, errors.New(msg)
	}
	PushMessageVideos()
	return &Empty{}, nil
}

type SetFirstTimeSelectDataDirResponse struct {
	Path string `json:"path"`
}

func (b BackendService) SetFirstTimeSelectDataDir(ctx context.Context, reqeust *Empty) (*SetFirstTimeSelectDataDirResponse, error) {

	dir, err := zenity.SelectFile(zenity.Directory())
	if err == nil {
		PushMessageSelectDataDir(dir)
	}

	return &SetFirstTimeSelectDataDirResponse{Path: dir}, nil
}

type SetFirstTimeRequest struct {
	IsMove   bool   `json:"is_move"`
	DataPath string `json:"data_path"`
}

func (b BackendService) SetFirstTime(ctx context.Context, request *SetFirstTimeRequest) (*Empty, error) {
	p := PreferenceModel{
		Key:   DataPath,
		Value: request.DataPath,
	}
	sqlite.Get().Save(&p)
	p = PreferenceModel{
		Key:   IsMove,
		Value: strconv.FormatBool(request.IsMove),
	}
	sqlite.Get().Save(&p)
	helper_os.TouchFile(helper.GetFirstFilePath(), true, true)
	return &Empty{}, nil
}

func (b BackendService) GetPreferences(ctx context.Context, request *Empty) (models []PreferenceModel, err error) {
	sqlite.Get().Find(&models)
	return models, nil
}

type SetPreferencesRequest struct {
	DataPath string `json:"data_path"`
	IsMove   bool   `json:"is_move"`
}

func (b BackendService) SetPreferences(ctx context.Context, request *SetPreferencesRequest) (*Empty, error) {
	p := PreferenceModel{
		Key:   DataPath,
		Value: request.DataPath,
	}
	sqlite.Get().Save(&p)
	p = PreferenceModel{
		Key:   IsMove,
		Value: strconv.FormatBool(request.IsMove),
	}
	sqlite.Get().Save(&p)
	return &Empty{}, nil
}

func (b BackendService) Quit(ctx context.Context, request *Empty) (*Empty, error) {
	os.Exit(0)
	return nil, nil
}

type GetAppInfoResponse struct {
	Version string `json:"version"`
	Build   string `json:"build"`
}

func (b BackendService) GetAppInfo(ctx context.Context, request *Empty) (*GetAppInfoResponse, error) {
	return &GetAppInfoResponse{
		Version: app.Version,
		Build:   app.Build,
	}, nil
}
