package main

import (
	"backend/app"
	"backend/helper"
	"flag"
	"github.com/langwan/langgo"
	"github.com/langwan/langgo/components/sqlite"
	"github.com/langwan/langgo/core"
	"github.com/langwan/langgo/core/log"
)

func init() {
	dbName := helper.GetDatabasePath()
	langgo.Run(&sqlite.Instance{Path: dbName})
	log.Logger("app", "init").Debug().Str("version", app.Version).Str("build", app.Build).Send()
}

func main() {

	var port int
	flag.IntVar(&port, "port", 8000, "port")
	flag.Parse()
	WorkerStart()
	core.GetComponentConfiguration("app", &app.Configuration)
	httpStart(port)
}
