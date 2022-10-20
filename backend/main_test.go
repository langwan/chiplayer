package main

import (
	"backend/helper"
	"github.com/langwan/langgo"
	"github.com/langwan/langgo/components/sqlite"
	"github.com/stretchr/testify/assert"
	"gorm.io/gorm"
	"path/filepath"
	"testing"
)

func TestSqlite(t *testing.T) {
	type account struct {
		gorm.Model
		Name string
	}
	dbPath := filepath.Join(helper.GetAppStorePath(), "db.db")
	langgo.Run(&sqlite.Instance{Path: dbPath})
	err := sqlite.Get().AutoMigrate(&account{})
	assert.NoError(t, err)
	acc := account{Name: "langgo"}
	sqlite.Get().Create(&acc)
	acc2 := account{}
	sqlite.Get().First(&acc2, "name=?", acc.Name)
	assert.Equal(t, acc.Name, acc2.Name)
	t.Log(acc2.Name)
}
