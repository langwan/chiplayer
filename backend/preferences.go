package main

import "github.com/langwan/langgo/components/sqlite"

const (
	DataPath = "data_path"
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
