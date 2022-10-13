package main

type _Preferences struct {
	isMove bool `yaml:"is_move"`
}

var Preferences = _Preferences{isMove: true}
