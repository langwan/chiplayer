package main

import (
	"backend/helper"
	"backend/pb"
	"context"
	"github.com/langwan/langgo/components/sqlite"
	helper_os "github.com/langwan/langgo/helpers/os"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"os"
	"path"
	"path/filepath"
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
func (b BackendService) AssetList(ctx context.Context, empty *pb.Empty) (*pb.AssetListResponse, error) {

	files, err := os.ReadDir(helper.GetDefaultDataPath())
	if err != nil {
		return nil, err
	}
	response := pb.AssetListResponse{}

	for _, file := range files {
		if file.Name() == ".DS_Store" {
			continue
		}
		info, err := file.Info()
		if err != nil {
			continue
		}
		response.Assets = append(response.Assets, &pb.Asset{
			Name:    file.Name(),
			ModTime: info.ModTime().UnixNano(),
		})
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
	return &response, nil
}

func (b BackendService) FileAdd(ctx context.Context, request *pb.FileAddRequest) (*pb.Empty, error) {
	if !helper_os.FileExists(request.GetFilePath()) {
		return &pb.Empty{}, status.Error(codes.NotFound, "文件不存在")
	}

	dataPath := Preferences.GetString(DataPath, helper.GetDefaultDataPath())
	filename := filepath.Base(request.GetFilePath())
	dst := filepath.Join(dataPath, request.GetAssetName(), filename)
	task := TaskModel{
		AssetName:     request.GetAssetName(),
		Name:          filename,
		LocalPath:     request.GetFilePath(),
		DstPath:       dst,
		TotalBytes:    0,
		ConsumedBytes: 0,
		IsCompleted:   false,
		Error:         "",
	}
	err := TaskAdd(&task)
	if err != nil {
		return nil, status.Errorf(codes.Aborted, "%v", err)
	}
	go RequestStart(&task)
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
