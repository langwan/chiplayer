package app

const (
	StoreName      = ".chiplayer"
	AppName        = "chiplayer"
	AppDisplayName = "CHIPLAYER"
)

var (
	Version = "1.0.1"
	Build   = "2022-11-03T07:13:31+0800"
)

type configuration struct {
	HttpPort int `yaml:"http_port"`
}

var Configuration = configuration{HttpPort: 8000}
