<?php
    header( "Content-Type: application/octet-stream");
    $file = $_GET['file'];
    if ($file && preg_match("#^https?:\/\/.+?\.(ttf|woff|svg|eot)$#i", $file, $matches)) {
        echo file_get_contents($matches[0]);
    }