package main

import (
	"backend/app"
	"backend/helper"
	gosocketio "github.com/ambelovsky/gosf-socketio"
	"github.com/ambelovsky/gosf-socketio/transport"
	"github.com/gin-gonic/gin"
	"github.com/langwan/langgo/components/sqlite"
	"github.com/langwan/langgo/core/log"
	helper_os "github.com/langwan/langgo/helpers/os"
	"time"
)

var socketio *gosocketio.Server

type Message struct {
	Method string      `json:"method"`
	Body   interface{} `json:"body"`
}

type MessageTask struct {
	Id            uint      `json:"id"`
	UpdatedAt     time.Time `json:"updated_at"`
	AssetName     string    `json:"asset_name"`
	Name          string    `json:"name"`
	LocalPath     string    `json:"local_path"`
	DstPath       string    `json:"dst_path"`
	TotalBytes    int64     `json:"total_bytes"`
	ConsumedBytes int64     `json:"consumed_bytes"`
	IsCompleted   bool      `json:"is_completed"`
	Error         string    `json:"error"`
}

func NewSocketIO(g *gin.Engine) {
	socketio = gosocketio.NewServer(transport.GetDefaultWebsocketTransport())
	g.Any("/socket.io/*any", gin.WrapH(socketio))
	socketio.On(gosocketio.OnConnection, func(c *gosocketio.Channel) {
		PushAppInfo()
		if !CheckFirstTimeFile() {
			PushMessageFirstTime()
		}
	})
}

func CheckFirstTimeFile() bool {
	p := helper.GetFirstFilePath()
	return helper_os.FileExists(p)
}

func PushMessageFirstTime() {

	sqlite.Get().AutoMigrate(&PreferenceModel{}, &TaskModel{}, &AssetModel{})
	p := PreferenceModel{
		Key:   DataPath,
		Value: helper.GetDefaultDataPath(),
	}
	sqlite.Get().Create(&p)
	p = PreferenceModel{
		Key:   IsMove,
		Value: "false",
	}
	sqlite.Get().Create(&p)

	message := Message{
		Method: "firstTime",
		Body:   nil,
	}
	socketio.BroadcastToAll("push", message)
	log.Logger("app", "socketio").Info().Interface("message", message).Msg("push")
}

func PushMessageTasks() {
	var tasks []TaskModel
	sqlite.Get().Find(&tasks)

	messageTask := make([]MessageTask, len(tasks))
	i := 0
	for _, task := range tasks {
		messageTask[i] = MessageTask{
			Id:            task.ID,
			UpdatedAt:     task.UpdatedAt,
			AssetName:     task.AssetName,
			Name:          task.Name,
			LocalPath:     task.LocalPath,
			DstPath:       task.DstPath,
			TotalBytes:    task.TotalBytes,
			ConsumedBytes: task.ConsumedBytes,
			IsCompleted:   task.IsCompleted,
			Error:         task.Error,
		}
		i++
	}
	message := Message{
		Method: "tasks",
		Body:   messageTask,
	}
	socketio.BroadcastToAll("push", message)
	log.Logger("app", "socketio").Info().Interface("message", message).Msg("push")
}
func PushMessageVideos() {
	message := Message{
		Method: "videos",
		Body:   nil,
	}
	socketio.BroadcastToAll("push", message)
	log.Logger("app", "socketio").Info().Interface("message", message).Msg("push")
}

func PushMessageAssets() {
	message := Message{
		Method: "assets",
		Body:   nil,
	}
	socketio.BroadcastToAll("push", message)
	log.Logger("app", "socketio").Info().Interface("message", message).Msg("push")
}

func PushMessageSelectDataDir(dir string) {
	message := Message{
		Method: "selectDataDir",
		Body:   dir,
	}
	log.Logger("app", "socketio").Info().Interface("message", message).Msg("push")
	socketio.BroadcastToAll("push", message)

}

func PushAppInfo() {
	message := Message{
		Method: "app",
		Body: struct {
			Version string `json:"version"`
			Build   string `json:"build"`
		}{Version: app.Version, Build: app.Build},
	}
	socketio.BroadcastToAll("push", message)
}
