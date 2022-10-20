package main

import (
	"backend/pb"
	"context"
	"fmt"
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

func TestBackendService_FileAdd1(t *testing.T) {
	WorkerStart()
	type args struct {
		ctx     context.Context
		request *pb.FileAddRequest
	}
	tests := []struct {
		name    string
		args    args
		want    *pb.Empty
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "",
			args: args{
				ctx: context.Background(),
				request: &pb.FileAddRequest{
					AssetName: "学习",
					FilePath:  "samples/sample1.mp4",
				},
			},
			want:    &pb.Empty{},
			wantErr: assert.NoError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			b := BackendService{}
			got, err := b.FileAdd(tt.args.ctx, tt.args.request)
			if !tt.wantErr(t, err, fmt.Sprintf("FileAdd(%v, %v)", tt.args.ctx, tt.args.request)) {
				return
			}
			assert.Equalf(t, tt.want, got, "FileAdd(%v, %v)", tt.args.ctx, tt.args.request)
		})
	}
}
