#!/bin/bash
NAME="chiplayer"
VERSION="1.0.1"
BUILD=`date +%FT%T%z`
echo ${BUILD}
echo "-X backend/app.Version=${VERSION} -X backend/app.Build=${BUILD}"
echo "清理"
rm -rf ../../bin
mkdir ../../bin

cd ../../backend
echo "编译mac"
go build -ldflags "-X backend/app.Version=${VERSION} -X backend/app.Build=${BUILD}" -o ../bin/${NAME}_backend

echo "编译win"
GOOS=windows GOARCH=amd64 go build -ldflags "-X backend/app.Version=${VERSION} -X backend/app.Build=${BUILD}" -o ../bin/${NAME}_backend.exe

echo "编译前端"
cd ../frontend
yarn build

echo "打包"
cd ..
rm -rf window/src/bin
mv bin window/src
cd window
jq ".version=\"${VERSION}\"" package.json > package.json.tmp
mv package.json.tmp package.json
yarn dist