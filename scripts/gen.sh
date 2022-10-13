echo "生成 rpc 代码"

OUT=../backend/pb
protoc \
--go_out=${OUT} \
--go-grpc_out=${OUT} \
--go-grpc_opt=require_unimplemented_servers=false \
backend.proto


