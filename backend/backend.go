package main

import (
	"backend/pb"
	"context"
)

type BackendService struct {
}

func (b BackendService) Hello(ctx context.Context, empty *pb.Empty) (*pb.HelloResponse, error) {
	return &pb.HelloResponse{Message: "hello"}, nil
}
