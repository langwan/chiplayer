package helper

import (
	"backend/app"
	helper_os "github.com/langwan/langgo/helpers/os"
	"path/filepath"

	"github.com/langwan/langgo/helpers/platform"
	"path"
)

func GetAppStorePath() string {
	path := filepath.Join(helper_platform.GetDefaultDocumentFolderPath(), app.StoreName)
	helper_os.CreateFolder(path, true)
	return path
}

func GetDefaultDataPath() string {
	path := filepath.Join(GetAppStorePath(), "data")
	helper_os.CreateFolder(path, true)
	return path
}

func GetDatabasePath() string {
	return path.Join(GetAppStorePath(), app.AppName+".db")
}
