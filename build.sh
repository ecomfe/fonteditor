#!/bin/bash

# 时间戳
version=`date "+%Y%m%d"`

# build首页版本
build_index() {
    node "./build/build-index.js" $version
}

# build静态资源
build_asset() {
    edp build --stage=release --force
    echo "asset path：./release"
}


# 移动文件到指定目录
move_asset() {
    mv ./release/src ./release/$version
    cp ./*.html ./release/
}

build_index
build_asset
move_asset
