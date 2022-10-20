#bin/bash

BACKEND_PATH=../../backend

cd ${BACKEND_PATH}

go build -o ../bin/backend
echo "编译win"
GOOS=windows GOARCH=amd64 go build -o ../bin/backend.exe