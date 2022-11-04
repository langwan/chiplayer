VERSION="1.0.3"
echo ".version=\"${VERSION}\""
cd ../../window
jq ".version=\"${VERSION}\"" package.json > package.json.tmp
mv package.json.tmp package.json
yarn dist