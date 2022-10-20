package main

import (
	"github.com/langwan/langgo/components/sqlite"
	"strconv"
)

const (
	DataPath = "data_path"
	IsMove   = "is_move"
)

type _Preferences struct {
	isMove   bool   `yaml:"is_move"`
	isFirst  bool   `yaml:"is_first"`
	DataPath string `yaml:"data_path"`
}

var Preferences = _Preferences{isMove: true}

func (p *_Preferences) GetString(key string, def string) (value string) {
	model := PreferenceModel{}
	res := sqlite.Get().First(&model, "key=?", key)
	if res.RowsAffected > 0 {
		return model.Value
	} else {
		return def
	}
}

func (p *_Preferences) GetBool(key string, def bool) (value bool) {
	model := PreferenceModel{}
	res := sqlite.Get().First(&model, "key=?", key)
	if res.RowsAffected > 0 {
		var err error
		value, err = strconv.ParseBool(model.Value)
		if err != nil {
			return def
		} else {
			return value
		}
	} else {
		return def
	}
}
