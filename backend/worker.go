package main

import (
	"errors"
	"github.com/langwan/langgo/components/sqlite"
	"github.com/langwan/langgo/core/log"
	helper_os "github.com/langwan/langgo/helpers/os"
)

const workers = 10

var jobs = make(chan *Request, 100)

type Listener struct {
	req *Request
}

func (l *Listener) ProgressChanged(event *helper_os.ProgressEvent) {
	l.req.Task.ConsumedBytes = event.ConsumedBytes
	sqlite.Get().Save(&l.req.Task)

	var tasks []TaskModel
	sqlite.Get().Find(&tasks)

	if socketio != nil {
		socketio.BroadcastToAll("push", &struct {
			Method string      `json:"method"`
			Body   interface{} `json:"body"`
		}{
			Method: "tasks",
			Body:   tasks,
		})
	}

	return
}

func Worker(id int, jobs <-chan *Request) {
	for req := range jobs {
		log.Logger("app", "worker").Debug().Int("id", id).Uint("taskId", req.Task.ID).Send()
		if _, ok := Requests.Load(req.Task.ID); !ok {
			req.Failed <- errors.New("task not find")
		}
		listener := Listener{req: req}
		buf := make([]byte, 1024*1024)
		var err error
		if Preferences.GetBool(IsMove, false) {
			_, err = helper_os.MoveFileWatcher(req.Task.DstPath, req.Task.LocalPath, buf, &listener)
		} else {
			_, err = helper_os.CopyFileWatcher(req.Task.DstPath, req.Task.LocalPath, buf, &listener)
		}
		if err != nil {
			req.Failed <- err
		} else {
			req.Result <- struct{}{}
		}
	}
}

func WorkerStart() {
	for i := 0; i < workers; i++ {
		go Worker(i, jobs)
	}
}
