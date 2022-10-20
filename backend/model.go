package main

import "gorm.io/gorm"

type PreferenceModel struct {
	Key   string `gorm:"primaryKey"`
	Value string
}

type TaskModel struct {
	gorm.Model
	AssetName     string
	Name          string
	LocalPath     string
	DstPath       string
	TotalBytes    int64
	ConsumedBytes int64
	IsCompleted   bool
	Error         string
}
