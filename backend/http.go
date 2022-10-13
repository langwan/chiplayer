package main

import (
	"github.com/gin-gonic/gin"
	helperGin "github.com/langwan/langgo/helpers/gin"
	helperGrpc "github.com/langwan/langgo/helpers/grpc"
	"io"
)

func httpStart() {
	g := gin.New()
	rg := g.Group("rpc")
	rg.Any("/*uri", requestProxy())
	g.Run(":8000")
}

func requestProxy() gin.HandlerFunc {

	backend := BackendService{}

	return func(c *gin.Context) {

		methodName := c.Param("uri")[1:]

		body, err := io.ReadAll(c.Request.Body)
		if err != nil {
			return
		}

		if err != nil {
			c.AbortWithStatus(500)
			return
		}

		response, code, err := helperGrpc.Call(backend, methodName, string(body), nil)

		if err != nil {
			c.AbortWithStatus(500)
			return
		} else if code != 0 {
			helperGin.SendBad(c, code, response, nil)
		}

		helperGin.SendOk(c, response)
	}
}
