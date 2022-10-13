package main

import (
	"backend/pb"
	"context"
	jsoniter "github.com/json-iterator/go"
	helperGrpc "github.com/langwan/langgo/helpers/grpc"
	"testing"
)

func BenchmarkGrpcCall(b *testing.B) {
	s := BackendService{}
	req := pb.Empty{}
	marshal, err := jsoniter.ConfigCompatibleWithStandardLibrary.Marshal(req)
	if err != nil {
		return
	}
	reqString := string(marshal)
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		helperGrpc.Call(s, "Hello", reqString, nil)
	}
}

func BenchmarkSerivceHello(b *testing.B) {
	s := BackendService{}
	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		s.Hello(context.Background(), &pb.Empty{})
	}
}
