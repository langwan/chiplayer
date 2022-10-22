package main

import (
	gosocketio "github.com/ambelovsky/gosf-socketio"
	"github.com/ambelovsky/gosf-socketio/transport"
	"github.com/gin-gonic/gin"
	"github.com/langwan/langgo/components/sqlite"
	"github.com/langwan/langgo/core/log"
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
		log.Logger("app", "socketio").Info().Str("id", c.Id()).Msg("OnConnection")
		c.Emit("hello", "im ss")
		go PushMessageTasks()
	})
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
