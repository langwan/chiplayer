package main

import (
	"context"
	"fmt"
	"github.com/stretchr/testify/assert"
	"os"
	"testing"
)

func TestBackendService_FileRename(t *testing.T) {
	type args struct {
		ctx     context.Context
		request *FileRenameRequest
	}
	tests := []struct {
		name    string
		args    args
		want    *Empty
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "rename",
			args: args{
				ctx: context.Background(),
				request: &FileRenameRequest{
					AssetName: "学习",
					Name:      "Raindrops_Macro2_Videvo.mov",
					NewName:   "1.mov",
				},
			},
			want:    &Empty{},
			wantErr: assert.NoError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			b := BackendService{}
			got, err := b.FileRename(tt.args.ctx, tt.args.request)
			if !tt.wantErr(t, err, fmt.Sprintf("FileRename(%v, %v)", tt.args.ctx, tt.args.request)) {
				return
			}
			assert.Equalf(t, tt.want, got, "FileRename(%v, %v)", tt.args.ctx, tt.args.request)
		})
	}
}

func TestOsRename(t *testing.T) {
	err := os.Rename("/Users/langwan/Documents/.chiplayer/data/学习/Raindrops_Macro2_Videvo.mov", "1.mov")
	assert.NoError(t, err)
}

func TestBackendService_AssetRename(t *testing.T) {
	type args struct {
		ctx     context.Context
		request *AssetRenameRequest
	}
	tests := []struct {
		name    string
		args    args
		want    *Empty
		wantErr assert.ErrorAssertionFunc
	}{
		{
			name: "rename",
			args: args{
				ctx: context.Background(),
				request: &AssetRenameRequest{
					Name:    "学习",
					NewName: "学习1",
				},
			},
			want:    &Empty{},
			wantErr: assert.NoError,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			b := BackendService{}
			got, err := b.AssetRename(tt.args.ctx, tt.args.request)
			if !tt.wantErr(t, err, fmt.Sprintf("AssetRename(%v, %v)", tt.args.ctx, tt.args.request)) {
				return
			}
			assert.Equalf(t, tt.want, got, "AssetRename(%v, %v)", tt.args.ctx, tt.args.request)
		})
	}
}
