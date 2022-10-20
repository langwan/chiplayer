package main

import (
	"errors"
	"github.com/langwan/langgo/components/sqlite"
	"github.com/langwan/langgo/helpers/os"
	"sync"
)

func TaskAdd(task *TaskModel) error {

	info, err := helper_os.GetFileInfo(task.LocalPath)

	if err != nil {
		return err
	}

	task.TotalBytes = info.Stat.Size()

	res := sqlite.Get().Create(&task)
	if res.RowsAffected != 1 {
		return res.Error
	}

	return nil
}

type Request struct {
	TaskId uint
	Task   *TaskModel
	Result chan struct{}
	Failed chan error
}

var Requests sync.Map

func RequestStart(task *TaskModel) (err error) {
	if task.IsCompleted {
		return errors.New("任务已经完成")
	}

	req := RequestGet(task.ID)

	if req != nil {
		return errors.New("任务已经开始，还在执行")
	}

	req = &Request{TaskId: task.ID, Task: task, Result: make(chan struct{}), Failed: make(chan error)}
	Requests.Store(task.ID, req)

	go func() {
		jobs <- req
	}()

	select {
	case <-req.Result:

	case err = <-req.Failed:

	}
	if err != nil {
		task.Error = err.Error()
	}

	task.IsCompleted = true
	sqlite.Get().Save(task)

	return err
}

func RequestGet(id uint) *Request {
	data, ok := Requests.Load(id)
	if !ok {
		return nil
	}
	return data.(*Request)
}
