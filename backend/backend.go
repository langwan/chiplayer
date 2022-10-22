package main

import (
	"backend/helper"
	"backend/pb"
	"context"
	"github.com/langwan/langgo/components/sqlite"
	helper_os "github.com/langwan/langgo/helpers/os"
	helper_platform "github.com/langwan/langgo/helpers/platform"
	"github.com/ncruces/zenity"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"os"
	"path"
	"path/filepath"
	"sort"
)

type BackendService struct {
}

func (b BackendService) TaskList(ctx context.Context, empty *pb.Empty) (tasks []TaskModel, err error) {

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
}

type AssetListResponse struct {
	Assets []*AssetListItem `json:"assets"`
}

func (b BackendService) AssetList(ctx context.Context, empty *pb.Empty) (*AssetListResponse, error) {

	files, err := os.ReadDir(helper.GetDefaultDataPath())
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

func (b BackendService) AssetItemList(ctx context.Context, request *pb.AssetItemListRequest) (*pb.AssetItemListResponse, error) {
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	assetPath := filepath.Join(dataPath, request.GetAssetName())
	files, err := helper_os.ReadDir(assetPath, true)
	if err != nil {
		return nil, err
	}
	response := pb.AssetItemListResponse{}

	for _, file := range files {
		info, err := file.Info()
		if err != nil {
			continue
		}
		response.Items = append(response.Items, &pb.Item{
			Name:      file.Name(),
			IsFolder:  file.IsDir(),
			FileSize:  info.Size(),
			ModTime:   info.ModTime().UnixNano(),
			PlayerUri: path.Join("/player", request.GetAssetName(), file.Name()),
		})
	}

	sort.Slice(response.Items, func(i, j int) bool {
		return response.Items[i].ModTime > response.Items[j].ModTime
	})

	return &response, nil
}

func (b BackendService) FileAdd(ctx context.Context, request *pb.FileAddRequest) (*pb.Empty, error) {

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
		dst := filepath.Join(dataPath, request.GetAssetName(), filename)
		task := TaskModel{
			AssetName:     request.GetAssetName(),
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

	return &pb.Empty{}, nil
}

func (b BackendService) AssetAdd(ctx context.Context, request *pb.AssetAddRequest) (*pb.Empty, error) {
	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	assetPath := filepath.Join(dataPath, request.GetAssetName())
	if helper_os.FileExists(assetPath) {
		return &pb.Empty{}, status.Error(codes.AlreadyExists, "资料夹已经存在")
	}
	err := helper_os.CreateFolder(assetPath, false)
	if err != nil {
		return &pb.Empty{}, status.Error(codes.Aborted, err.Error())
	}
	return &pb.Empty{}, nil
}

func (b BackendService) Hello(ctx context.Context, empty *pb.Empty) (*pb.HelloResponse, error) {
	return &pb.HelloResponse{Message: "hello"}, nil
}

type OpenDataFileRequest struct {
	Path string `json:"path"`
}

func (b BackendService) OpenDataFile(ctx context.Context, request *OpenDataFileRequest) (*pb.Empty, error) {
	helper_platform.OpenFileExplorer(request.Path)
	return &pb.Empty{}, nil
}

func (b BackendService) EraserAll(ctx context.Context, empty *pb.Empty) (*pb.Empty, error) {
	var tasks []TaskModel
	sqlite.Get().Where("1 = 1").Unscoped().Delete(&tasks)
	go PushMessageTasks()
	return &pb.Empty{}, nil
}

type EraserRequest struct {
	Ids []string `json:"ids"`
}

func (b BackendService) Eraser(ctx context.Context, request *EraserRequest) (*pb.Empty, error) {
	var tasks []TaskModel
	sqlite.Get().Unscoped().Delete(&tasks, "id in ?", request.Ids)
	go PushMessageTasks()
	return &pb.Empty{}, nil
}
