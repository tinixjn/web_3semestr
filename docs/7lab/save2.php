<?php
date_default_timezone_set('Europe/Kiev');
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$body = file_get_contents("php://input");
$data = json_decode($body, true);

if (!is_dir("data")) {
    mkdir("data", 0755, true);
}

$file = "data/events.json";
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(["ok"=>true]);
?>