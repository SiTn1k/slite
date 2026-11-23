<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false]);
    exit;
}

$BOT_TOKEN = getenv('TELEGRAM_BOT_TOKEN') ?: '%%TELEGRAM_BOT_TOKEN%%';
$CHAT_IDS  = array_filter(array_map('trim', explode(',', getenv('TELEGRAM_CHAT_ID') ?: '%%TELEGRAM_CHAT_ID%%')));

$body = json_decode(file_get_contents('php://input'), true);
$type = $body['type'] ?? '';

if ($type === 'form') {
    $name     = trim($body['name'] ?? '');
    $phone    = trim($body['phone'] ?? '');
    $category = trim($body['category'] ?? '');
    $service  = trim($body['service'] ?? '');
    $desc     = trim($body['description'] ?? '');

    $lines = ['📋 <b>Нова заявка з сайту</b>'];
    if ($name)     $lines[] = "👤 Ім'я: $name";
    $lines[]               = "📞 Телефон: <b>$phone</b>";
    if ($category) $lines[] = "🔧 Напрямок: $category" . ($service ? ", $service" : '');
    if ($desc)     $lines[] = "📝 Завдання: $desc";

    $text = implode("\n", $lines);
} elseif ($type === 'call') {
    $phone = trim($body['phone'] ?? '');
    $text  = "📞 <b>Натиснули «Зателефонувати»</b>\nНомер: $phone";
} else {
    http_response_code(400);
    echo json_encode(['ok' => false]);
    exit;
}

$url = "https://api.telegram.org/bot$BOT_TOKEN/sendMessage";
$ctx = stream_context_create(['http' => [
    'method'        => 'POST',
    'header'        => 'Content-Type: application/x-www-form-urlencoded',
    'ignore_errors' => true,
]]);

$last = null;
foreach ($CHAT_IDS as $chat_id) {
    $ctx_copy = stream_context_create(['http' => [
        'method'        => 'POST',
        'header'        => 'Content-Type: application/x-www-form-urlencoded',
        'content'       => http_build_query(['chat_id' => $chat_id, 'text' => $text, 'parse_mode' => 'HTML']),
        'ignore_errors' => true,
    ]]);
    $last = file_get_contents($url, false, $ctx_copy);
}

echo $last ?: json_encode(['ok' => false]);
