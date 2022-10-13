package helper

import (
	"backend/app"
	"github.com/langwan/langgo/helpers/io"
	"github.com/langwan/langgo/helpers/platform"
	"path"
)

func GetAppStorePath() string {
	path := path.Join(platform.GetDefaultDocumentFolderPath(), app.StoreName)
	io.CreateFolder(path, true)
	return path
}

func GetDefaultDataPath() string {
	path := path.Join(GetAppStorePath(), "data")
	io.CreateFolder(path, true)
	return path
}
