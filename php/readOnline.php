<?php
    header( "Content-Type: application/octet-stream");
    $file = $_GET['file'];
    $type = $_GET['type'];
    if ($type === 'font' && $file && preg_match("#^https?:\/\/.+?\.(ttf|woff|svg|eot)$#i", $file, $matches)) {
        echo file_get_contents($matches[0]);
    }
    else if ($type === 'image' && $file && preg_match("#^https?:\/\/.+?\.(jpg|jpeg|gif|bmp|png|svg)$#i", $file, $matches)) {
        echo file_get_contents($matches[0]);
    }
