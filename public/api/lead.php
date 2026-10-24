<?php
// Приймає заявку з форми: зберігає у data/leads.jsonl і шле диспетчеру в Telegram.
// Токен бота береться з config.php, який створює GitHub Actions із секретів (у репозиторії його немає).
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function out(int $code, array $body): void
{
    http_response_code($code);
    echo json_encode($body);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    out(405, ['ok' => false]);
}

// Лише з нашого сайту.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && parse_url($origin, PHP_URL_HOST) !== ($_SERVER['HTTP_HOST'] ?? '')) {
    out(403, ['ok' => false]);
}

$raw = file_get_contents('php://input', false, null, 0, 8192);
$in = json_decode((string) $raw, true);
if (!is_array($in)) {
    out(400, ['ok' => false]);
}

$clean = static fn($v, int $max): string => mb_substr(trim(strip_tags((string) ($v ?? ''))), 0, $max);
$phone = $clean($in['phone'] ?? '', 20);
if (!preg_match('/^\+380\d{9}$/', $phone)) {
    out(422, ['ok' => false, 'error' => 'phone']);
}
$lead = [
    'time' => date('c'),
    'name' => $clean($in['name'] ?? '', 80),
    'phone' => $phone,
    'category' => $clean($in['category'] ?? '', 60),
    'service' => $clean($in['service'] ?? '', 100),
    'description' => $clean($in['description'] ?? '', 1000),
];

$dir = __DIR__ . '/data';
if (!is_dir($dir)) {
    @mkdir($dir, 0750, true);
    @file_put_contents(
        $dir . '/.htaccess',
        "<IfModule mod_authz_core.c>\nRequire all denied\n</IfModule>\n<IfModule !mod_authz_core.c>\nDeny from all\n</IfModule>\n"
    );
}

// Не частіше 1 заявки на 20 секунд з однієї адреси.
$rate = $dir . '/rate-' . md5($_SERVER['REMOTE_ADDR'] ?? '');
if (is_file($rate) && time() - filemtime($rate) < 20) {
    out(429, ['ok' => false, 'error' => 'rate']);
}
@touch($rate);

$saved = @file_put_contents(
    $dir . '/leads.jsonl',
    json_encode($lead, JSON_UNESCAPED_UNICODE) . "\n",
    FILE_APPEND | LOCK_EX
) !== false;

$sent = false;
$cfgFile = __DIR__ . '/config.php';
$cfg = is_file($cfgFile) ? require $cfgFile : [];
if (!empty($cfg['token']) && !empty($cfg['chat'])) {
    $lines = ['Нова заявка з сайту MAYA'];
    if ($lead['name'] !== '') $lines[] = 'Ім’я: ' . $lead['name'];
    $lines[] = 'Телефон: ' . $lead['phone'];
    $lines[] = 'Telegram: https://t.me/' . $lead['phone'];
    if ($lead['category'] !== '') $lines[] = 'Напрямок: ' . $lead['category'] . ($lead['service'] !== '' ? ', ' . $lead['service'] : '');
    if ($lead['description'] !== '') $lines[] = 'Завдання: ' . $lead['description'];
    $lines[] = 'Клієнт чекає дзвінка диспетчера.';

    $ctx = stream_context_create(['http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
        'content' => http_build_query(['chat_id' => $cfg['chat'], 'text' => implode("\n", $lines)]),
        'timeout' => 8,
        'ignore_errors' => true,
    ]]);
    $resp = @file_get_contents('https://api.telegram.org/bot' . $cfg['token'] . '/sendMessage', false, $ctx);
    $sent = $resp !== false && (json_decode($resp, true)['ok'] ?? false) === true;
}

if (!$saved && !$sent) {
    out(502, ['ok' => false]);
}
out(200, ['ok' => true]);
