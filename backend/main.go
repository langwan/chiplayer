package main

import (
	"backend/app"
	"backend/helper"
	"flag"
	"github.com/langwan/langgo"
	"github.com/langwan/langgo/components/sqlite"
	"github.com/langwan/langgo/core"
)

func init() {
	dbName := helper.GetDatabasePath()
	langgo.Run(&sqlite.Instance{Path: dbName})
	if core.EnvName == core.Development {
		sqlite.Get().AutoMigrate(&PreferenceModel{}, &TaskModel{}, &AssetModel{})
	}
}

func main() {
	var port int
	flag.IntVar(&port, "port", 8000, "port")
	flag.Parse()
	WorkerStart()
	core.GetComponentConfiguration("app", &app.Configuration)
	httpStart(port)
}
