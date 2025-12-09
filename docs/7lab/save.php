<?php
date_default_timezone_set('Europe/Kiev');
header("Access-Control-Allow-Origin: *");
header('Content-Type: application/json');

$body = file_get_contents("php://input");
if (!$body) {
    echo json_encode(["ok"=>false,"error"=>"empty body"]);
    exit;
}
$data = json_decode($body, true);
if ($data === null) {
    echo json_encode(["ok"=>false,"error"=>"invalid json"]);
    exit;
}

if (!is_dir("data")) {
    mkdir("data", 0755, true);
}

$file = "data/events.json";
$existing = [];
if (file_exists($file)) {
    $existing = json_decode(file_get_contents($file), true) ?: [];
}

$data['serverTime'] = round(microtime(true) * 1000); 
$existing[] = $data;

file_put_contents($file, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(["ok"=>true, "serverTime" => $data['serverTime']]);
