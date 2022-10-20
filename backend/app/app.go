package app

const (
	StoreName      = ".chiplayer"
	AppName        = "chiplayer"
	AppDisplayName = "CHIPLAYER"
)

type configuration struct {
	HttpPort int `yaml:"http_port"`
}

var Configuration = configuration{HttpPort: 8000}
