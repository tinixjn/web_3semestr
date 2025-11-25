<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$body = file_get_contents("php://input");
if (!$body) {
    echo json_encode(["ok" => false, "error" => "empty body"]);
    exit;
}

$data = json_decode($body, true);
if ($data === null) {
    echo json_encode(["ok" => false, "error" => "invalid json"]);
    exit;
}

if (!isset($data['items']) || !is_array($data['items'])) {
    echo json_encode(["ok" => false, "error" => "missing items"]);
    exit;
}

if (!is_dir("data")) {
    mkdir("data", 0755, true);
}

$file = "data/collapses.json";
file_put_contents($file, json_encode($data['items'], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(["ok" => true]);
