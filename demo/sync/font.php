<?php
/**
 * @file 字体同步示例
 * 分为GET和POST两种方式：
 * GET使用JSONP，检查是否有更新，有的话则返回同步数据
 * POST使用跳转指定页面进行通知
 *
 * method: GET
 * GET参数:
 *     action: 当前动作，默认为`pull`拉取新数据
 *     callback: jsonp回调函数名
 *     fontName: fonteditor, 字体名称
 *     fontType: ttf, 字体类型
 *     timestamp: 上次更新的timestamp， -1 则为强制更新
 *     encode: 编码格式，默认`base64`
 *
 * 响应: {
 *     "status": 0
 *     "data": {
 *         "fontName": "fonteditor", // 字体名称
 *         "hasNew": 1, // 如果有新数据则标记为1, 同时设置fontType, timestamp, ttf字段
 *         "timestamp": 12345678, // 新纪录时间戳，unix timestamp 精确到毫秒
 *         "fontType": "ttf", // 新纪录类型
 *         "ttf": base64str // 新纪录的base64字体数据
 *     }
 * }
 *
 * method: POST
 * GET参数:
 *     action: 当前动作，默认为`push`推送数据
 * POST参数:
 *     callbackUrl: post回调函数地址，通过302跳转到回调地址，通知编辑器
 *     fontName: 字体名称
 *     fontType: 字体类型，多个类型用`,`隔开
 *     encode: 编码格式，默认`base64`
 *     ttf: 如果fontType包含`ttf`则为ttf格式字体base64数据
 *     woff: 如果fontType包含`woff`则为woff格式字体base64数据
 *     svg: 如果fontType包含`svg`则为svg格式字体base64数据
 *     eot: 如果fontType包含`eot`则为eot格式字体base64数据
 *
 * 响应: {
 *     "status": 0
 *     "data": {
 *         "fontName": "fonteditor", // 字体名称
 *         "timestamp": 12345678, // 新纪录时间戳
 *         "fontType": "ttf" // 新纪录类型
 *     }
 * }
 *
 * 回调地址调用方式：
 * callbackUrl + &data= urlencode( json_encode(data) )
 * 例如回调地址：`proxy.html?callback=xxxxxx`
 * 则回调的数据为：`proxy.html?callback=xxxxxx&data={"status":0,"data":{}}`
 *
 * @author mengke01(kekee000@gmail.com)
 */

define('SYNC_FILE', __DIR__ . '/list.md'); // 同步的文件



/**
 * 发送jsonp数据
 *
 * @param  number $status     当前状态，0为处理成功
 * @param  array $data       发送的数据
 * @param  string $statusInfo 状态描述
 */
function jsonp($status, $data = null, $statusInfo = null) {
    $callback = $_GET['callback'];
    $json = array(
        'status' => $status,
        'data' => $data,
    );
    if (!empty($statusInfo)) {
        $json['statusInfo'] = $statusInfo;
    }
    $json = json_encode($json);
    echo "$callback($json)";
}

/**
 * 获取毫秒计数的unix 时间戳
 *
 * @return number
 */
function getTimestamp() {
    return intval(microtime(true) * 1000);
}

/**
 * base64字符串转字节后写入到文件
 *
 * @param  string $base64Str  base64字符串
 * @param  string $file 输出文件地址
 * @return 写入的字节数或者false
 */
function writeBase64File($base64Str, $file) {
  $fileHandle = fopen($file, "wb");
  $ret = fwrite($fileHandle, base64_decode($base64Str));
  fclose($fileHandle);
  return $ret;
}

/**
 * 读取文件到base64字符串
 *
 * @param  string $file 输出文件地址
 * @return base64字符串
 */
function readBase64File($file) {
    $fileHandle = fopen($file, 'rb');
    $fontBuffer = fread($fileHandle, filesize($file));
    fclose($fileHandle);
    return base64_encode($fontBuffer);
}

/**
 * 获取同步的记录
 *
 * @return array
 */
function getSyncRecord() {
    if (file_exists(SYNC_FILE)) {
        $text = file_get_contents(SYNC_FILE);
        $json = json_decode($text, true);
        if(!empty($json)) {
            return $json;
        }
    }
    return array();
}


/**
 * 保存同步的记录
 */
function saveSyncRecord($data) {
    file_put_contents(SYNC_FILE, json_encode($data));
}

/**
 * 处理push方法
 */
function doPush() {
    $fontName = $_POST['fontName']; // 字体名字
    $fontType = $_POST['fontType']; // 字体类型，多个类型用`,`隔开

    if (empty($fontName)) {
        return;
    }

    $ret = array(); // 记录成功的类型

    foreach (explode(',', $fontType) as $type) {
        if (!empty($_POST[$type])) {
            writeBase64File($_POST[$type], "${fontName}.${type}");
            $ret[] = $type;
        }
    }

    // 保存同步记录
    $timestamp = getTimestamp();
    $recordList = getSyncRecord();
    $recordList[$fontName] = array(
        'user' => $_COOKIE['FONT_USER'],
        'timestamp' => $timestamp,
        'fontType' => $ret[0],
    );
    saveSyncRecord($recordList);

    // 根据回调地址进行返回结果
    if (!empty($_POST['callbackUrl'])) {
        $data = array(
            'status' => 0,
            'data' => array(
                'fontName' => $fontName,
                'fontType' => implode(',', $ret),
                'timestamp' => $timestamp
            )
        );
        $url = $_POST['callbackUrl'] . '&data=' . urlencode(json_encode($data));
        header('Location: ' . $url);
    }
}

/**
 * 处理拉取方法
 */
function doPull() {
    $fontName = $_GET['fontName'];
    $fontType = $_GET['fontType'];
    $timestamp = empty($_GET['timestamp']) ? 0 : intval($_GET['timestamp']);
    if (empty($fontName)) {
        return;
    }

    $recordList = getSyncRecord();
    if (!empty($recordList[$fontName])) {
        $record = $recordList[$fontName];
        //var_dump($record);
        // 最后一次提交不是当前用户，或者强制拉取
        if (
            ($record['user'] != $_COOKIE['FONT_USER'] && $record['timestamp'] > $timestamp)
            || -1 === $timestamp
        ) {

            $fontFile = "${fontName}.${fontType}";
            if (file_exists($fontFile)) {
                $data = array(
                    'fontName' => $fontName,
                    'hasNew' => 1,
                    'timestamp' => $record['timestamp'],
                    'fontType' => $fontType,
                );
                $data[$fontType] = readBase64File($fontFile);
                jsonp(0, $data);
                return;
            }
        }
    }

    $data = array(
        'fontName' => $fontName
    );
    jsonp(0, $data);
}


// 设置当前操作的帐号
if (empty($_COOKIE['FONT_USER'])) {
    $user = md5($_SERVER["REMOTE_ADDR"] . 'FONT_USER');
    $_COOKIE['FONT_USER'] = $user;
    setcookie('FONT_USER', $user, time() + 315360000); // 10年不过期
}

// 入口
$action = $_GET['action'];
if ($action == 'pull') {
    doPull();
}
else {
    doPush();
}
