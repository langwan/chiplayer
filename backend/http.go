package main

import (
	"backend/helper"
	"context"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/langwan/langgo/core"
	helper_code "github.com/langwan/langgo/helpers/code"
	helperGin "github.com/langwan/langgo/helpers/gin"
	"io"
	"net/http"
	"net/http/httputil"
	"net/url"
	"path"
	"time"
)

func httpStart(port int) {
	g := gin.New()

	if core.EnvName == core.Development {
		g.Use(cors.New(cors.Config{
			AllowAllOrigins:        true,
			AllowMethods:           []string{"POST"},
			AllowHeaders:           []string{"*	"},
			AllowCredentials:       false,
			ExposeHeaders:          nil,
			MaxAge:                 12 * time.Hour,
			AllowWildcard:          false,
			AllowBrowserExtensions: false,
			AllowWebSockets:        false,
			AllowFiles:             false,
		}))
	}

	rg := g.Group("rpc")
	rg.Any("/*uri", requestProxy())

	a := g.Group("app")
	a.Any("/*proxyPath", proxy)

	g.GET("/player/:assetName/:uri", func(c *gin.Context) {
		assetName := c.Param("assetName")
		uri := c.Param("uri")
		filename := path.Join(helper.GetDefaultDataPath(), assetName, uri)
		http.ServeFile(c.Writer, c.Request, filename)
	})
	g.Run(fmt.Sprintf(":%d", port))
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

		response, code, err := helper_code.Call(context.Background(), backend, methodName, string(body))

		if err != nil {
			c.AbortWithStatus(500)
			return
		} else if code != 0 {

			helperGin.SendBad(c, code, err.Error(), nil)
		}

		helperGin.SendOk(c, response)
	}
}

func proxy(c *gin.Context) {
	remote, err := url.Parse("http://localhost:3000")
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)
	//Define the director func
	//This is a good place to log, for example
	proxy.Director = func(req *http.Request) {
		req.Header = c.Request.Header
		req.Host = remote.Host
		req.URL.Scheme = remote.Scheme
		req.URL.Host = remote.Host
		p := path.Join("/app", c.Param("proxyPath"))
		req.URL.Path = p
	}

	proxy.ServeHTTP(c.Writer, c.Request)
}
