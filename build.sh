#!/bin/bash

# 时间戳
version=`date "+%Y%m%d"`

# build静态资源
build_asset() {
    edp build --stage=release --force
    echo "asset path：./release"
}

# build模板文件
build_tpl() {

    mv ./release/src ./release/$version

    cat ./release/index.html |
        sed -e "s#'\.\/src'#'./$version'#g" |
        tr -s "\n" " " |
        sed 's#[[:space:]]\+# #g' > ./release/index.tmp

    mv ./release/index.tmp ./release/index.html
}


build_asset
build_tpl
