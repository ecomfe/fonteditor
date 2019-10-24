#!/bin/bash
cd $(dirname $0)
[ -d ./dist ] && rm -r dist

npm run prod

cp -r dep dist
cp -r font dist
cp empty.html proxy.html dist
echo 'build to `dist` done'