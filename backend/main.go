package main

import (
	"backend/helper"
	"github.com/langwan/langgo"
	"github.com/langwan/langgo/components/sqlite"
	"path"
)

func main() {
	langgo.Run()
	dbPath := path.Join(helper.GetAppStorePath(), "db.db")
	langgo.RunComponent(&sqlite.Instance{Path: dbPath})
	httpStart()
}
