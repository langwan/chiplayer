echo "็ๆ rpc ไปฃ็ "

OUT=../backend/pb
protoc \
--go_out=${OUT} \
--go-grpc_out=${OUT} \
--go-grpc_opt=require_unimplemented_servers=false \
backend.proto


