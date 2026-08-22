<?php
/**
 * lab206.com contact form handler (cPanel / Apache PHP).
 * POST fields: name, email, subject, message, company_website (honeypot).
 * Responds with JSON: { "ok": true } | { "ok": false, "error": "..." }
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  header('Allow: POST, OPTIONS');
  http_response_code(204);
  exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  echo json_encode(['ok' => false, 'error' => 'Method not allowed']);
  exit;
}

$to = 'scott@lab206.com';

// Accept application/x-www-form-urlencoded or multipart
$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$subject = trim((string)($_POST['subject'] ?? 'General'));
$message = trim((string)($_POST['message'] ?? ''));
$honeypot = trim((string)($_POST['company_website'] ?? ''));

// Bot trap — pretend success
if ($honeypot !== '') {
  echo json_encode(['ok' => true]);
  exit;
}

if ($name === '' || mb_strlen($name) > 120) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Please enter your name.']);
  exit;
}

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 200) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Please enter a valid email.']);
  exit;
}

if ($message === '' || mb_strlen($message) > 5000) {
  http_response_code(400);
  echo json_encode(['ok' => false, 'error' => 'Please enter a message.']);
  exit;
}

$allowedSubjects = ['General', 'Commercial license', 'Support', 'Other'];
if (!in_array($subject, $allowedSubjects, true)) {
  $subject = 'General';
}

$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$mailSubject = '[lab206] ' . $subject . ' — ' . $safeName;

$body = "New message from lab206.com contact form\n\n";
$body .= "Name: {$safeName}\n";
$body .= "Email: {$safeEmail}\n";
$body .= "Subject: {$subject}\n";
$body .= "——\n\n";
$body .= $message . "\n";

$headers = [
  'MIME-Version: 1.0',
  'Content-Type: text/plain; charset=UTF-8',
  'From: lab206 contact <scott@lab206.com>',
  'Reply-To: ' . $safeEmail,
  'X-Mailer: lab206-contact',
];

$sent = @mail($to, $mailSubject, $body, implode("\r\n", $headers));

if (!$sent) {
  http_response_code(500);
  echo json_encode([
    'ok' => false,
    'error' => 'Could not send right now. Please try again later or email scott@lab206.com directly.',
  ]);
  exit;
}

echo json_encode(['ok' => true]);
