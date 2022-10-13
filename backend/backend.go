package main

import (
	"backend/helper"
	"backend/pb"
	"context"
	"github.com/langwan/langgo/helpers/io"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"os"
	"path"
)

type BackendService struct {
}

func (b BackendService) AssetItemList(ctx context.Context, request *pb.AssetItemListRequest) (*pb.AssetItemListResponse, error) {
	dirPath := path.Join(helper.GetDefaultDataPath(), request.GetAssetName())
	files, err := os.ReadDir(dirPath)
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
			Name:     file.Name(),
			IsFolder: file.IsDir(),
			FileSize: info.Size(),
			ModTime:  info.ModTime().UnixNano(),
		})
	}
	return &response, nil
}

func (b BackendService) FileAdd(ctx context.Context, request *pb.FileAddRequest) (*pb.Empty, error) {
	if !io.FileExists(request.GetFilePath()) {
		return &pb.Empty{}, status.Error(codes.NotFound, "文件不存在")
	}
	dataPath := helper.GetDefaultDataPath()
	filename := path.Base(request.GetFilePath())
	dest := path.Join(dataPath, request.GetAssetName(), filename)
	var err error
	if Preferences.isMove {
		err = io.MoveFile(request.GetFilePath(), dest)
	} else {
		err = io.CopyFile(request.GetFilePath(), dest)
	}

	if err != nil {
		return nil, status.Errorf(codes.Aborted, "%v", err)
	}
	return &pb.Empty{}, nil
}

func (b BackendService) AssetAdd(ctx context.Context, request *pb.AssetAddRequest) (*pb.Empty, error) {
	dataPath := helper.GetDefaultDataPath()
	assetPath := path.Join(dataPath, request.GetAssetName())
	if io.FileExists(assetPath) {
		return &pb.Empty{}, status.Error(codes.AlreadyExists, "资料夹已经存在")
	}
	err := io.CreateFolder(assetPath, false)
	if err != nil {
		return &pb.Empty{}, status.Error(codes.Aborted, err.Error())
	}
	return &pb.Empty{}, nil
}

func (b BackendService) Hello(ctx context.Context, empty *pb.Empty) (*pb.HelloResponse, error) {
	return &pb.HelloResponse{Message: "hello"}, nil
}
