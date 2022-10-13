package main

import (
	"backend/pb"
	"context"
	"github.com/stretchr/testify/assert"
	"testing"
)

func TestBackendService_AssetAdd(t *testing.T) {
	s := BackendService{}
	_, err := s.AssetAdd(context.Background(), &pb.AssetAddRequest{AssetName: "摄影"})
	assert.NoError(t, err)
}

func TestBackendService_FileAdd(t *testing.T) {
	s := BackendService{}
	_, err := s.FileAdd(context.Background(), &pb.FileAddRequest{
		AssetName: "摄影",
		FilePath:  "../samples/Homework.mp4",
	})
	assert.NoError(t, err)
}

func TestBackendService_AssetItemList(t *testing.T) {
	s := BackendService{}
	list, err := s.AssetItemList(context.Background(), &pb.AssetItemListRequest{AssetName: "摄影"})
	assert.NoError(t, err)
	assert.True(t, len(list.GetItems()) > 0)
}
