package main

import "gorm.io/gorm"

type PreferenceModel struct {
	Key   string `gorm:"primaryKey" json:"key"`
	Value string `json:"value"`
}

type TaskModel struct {
	gorm.Model    `json:"gorm_._model"`
	AssetName     string `json:"asset_name"`
	Name          string `json:"name"`
	LocalPath     string `json:"local_path"`
	DstPath       string `json:"dst_path"`
	TotalBytes    int64  `json:"total_bytes"`
	ConsumedBytes int64  `json:"consumed_bytes"`
	IsCompleted   bool   `json:"is_completed"`
	Error         string `json:"error"`
}

type AssetModel struct {
	Name  string `json:"name";gorm:"primaryKey"`
	Cover string `json:"cover"`
}
