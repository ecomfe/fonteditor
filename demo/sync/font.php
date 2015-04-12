<?php
    header('Content-Type: application/javascript');

    function callback($data) {
        echo json_encode($data);
    }


    function writeFile($base64Str, $outputfile) {
      $ifp = fopen($outputfile, "wb");
      fwrite($ifp, base64_decode( $base64Str));
      fclose($ifp);
      return($outputfile);
    }

    function main() {
        $fontName = $_POST['fontName']; // 字体名字
        $fontType = $_POST['fontType']; // 字体类型，多个类型用`,`隔开
        $encode = $_POST['encode']; // 编码，默认base64

        if (empty($fontName)) {
            callback(array(
                status => 1,
                statusInfo => '没有同步的字体名!'
            ));
            return;
        }

        $count = 0;
        if (empty($encode) || $encode === 'base64') {
            foreach (explode(',', $fontType) as $type) {
                if (!empty($_POST[$type])) {
                    writeFile($_POST[$type], $fontName.'.'.$type);
                    $count++;
                }
            }
        }

        callback(array(
            status => 0,
            statusInfo => 'sync '.$count.'font files.'
        ));
    }

    main();
