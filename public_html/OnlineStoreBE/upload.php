<?php

header("Access-Control-Allow-Origin: *");

function resize_image($file,$filename, $type, $w, $h, $crop = false) {
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width - ($width * abs($r - $w / $h)));
        } else {
            $height = ceil($height - ($height * abs($r - $w / $h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w / $h > $r) {
            $newwidth = $h * $r;
            $newheight = $h;
        } else {
            $newheight = $w / $r;
            $newwidth = $w;
        }
    }
    if ($type == 'jpg' || $type == 'JPG') {
        $src = imagecreatefromjpeg($file);
    }
    if ($type == 'png' || $type == 'PNG') {
        $src = imagecreatefrompng($file);
    }
    if ($type == 'gif' || $type == 'GIF') {
        $src = imagecreatefromgif($file);
    }
    $dst = imagecreatetruecolor($newwidth, $newheight);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
    $uploadPath = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR;
    imagejpeg($dst, $uploadPath.$filename .'.'.$type);
}

if (!empty($_FILES)) {

    $tempPath = $_FILES['file']['tmp_name'];
    $newName = 'dateAndTime';

    $temp = explode(".", $_FILES["file"]["name"]);
    if (isset($_GET['filename'])) {
        $filename = $_GET['filename'];
    } else {
        $filename = round(microtime(true));
    }

    $newfilename = $filename . '.' . end($temp);
//move_uploaded_file($_FILES["file"]["tmp_name"], "../img/imageDirectory/" . $newfilename);


    $uploadPath = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $newfilename;
    $uploadPathDB = 'http://' . $_SERVER['SERVER_NAME'] . '/OnlineStoreBE/uploads/' . $newfilename;

    move_uploaded_file($tempPath, $uploadPath);

    resize_image($uploadPathDB,$filename, end($temp), 300, 290, false);
    $answer = array('answer' => 'File transfer completed', 'imageUrl' => $uploadPathDB);
    $json = json_encode($answer);

    echo $json;
} else {

    echo 'No files';
}
?>