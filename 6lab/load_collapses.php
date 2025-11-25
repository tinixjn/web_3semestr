<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$file = "data/collapses.json";
if (!file_exists($file)) {
    echo json_encode([]);
    exit;
}

$content = file_get_contents($file);
$data = json_decode($content, true);
if ($data === null) $data = [];

echo json_encode($data);


