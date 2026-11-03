<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Método não permitido."]);
    exit();
}

$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

if (!$data) {
    $data = $_POST;
}

$nome = trim($data['nome'] ?? '');
$empresa = trim($data['empresa'] ?? $data['empresa_cnpj'] ?? '');
$email = trim($data['email'] ?? '');
$telefone = trim($data['telefone'] ?? $data['telefone_whatsapp'] ?? '');
$descricao = trim($data['descricao'] ?? $data['codigo_ou_descricao'] ?? '');
$protocolo = trim($data['protocolo'] ?? ('AMV-' . rand(100000, 999999)));

if (empty($nome) || empty($empresa) || empty($email) || empty($telefone) || empty($descricao)) {
    http_response_code(400);
    echo json_encode(["success" => false, "error" => "Campos obrigatórios ausentes."]);
    exit();
}

$to = "vendas@amilvix.com.br";
$subject = "=?UTF-8?B?" . base64_encode("[Nova Cotação Posital Fraba] {$empresa} - Protocolo {$protocolo}") . "?=";
$dataHora = date('d/m/Y H:i:s');

$html = "
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
</head>
<body style='font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px;'>
  <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;'>
    <div style='background-color: #0b3b60; color: #ffffff; padding: 20px; text-align: center;'>
      <h2 style='margin: 0; font-size: 20px;'>AMILVIX AUTOMAÇÃO</h2>
      <p style='margin: 5px 0 0 0; font-size: 13px; color: #38bdf8;'>Nova Solicitação de Cotação - Posital Fraba</p>
    </div>
    <div style='padding: 24px;'>
      <div style='background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 12px; border-radius: 6px; margin-bottom: 20px;'>
        <strong style='color: #166534; font-size: 14px;'>Protocolo: {$protocolo}</strong><br>
        <span style='font-size: 12px; color: #4b5563;'>Recebido em: {$dataHora}</span>
      </div>
      
      <table style='width: 100%; border-collapse: collapse; font-size: 14px;'>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; width: 140px;'><strong>Solicitante:</strong></td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;'><strong>" . htmlspecialchars($nome) . "</strong></td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;'><strong>Empresa / CNPJ:</strong></td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #1e293b;'>" . htmlspecialchars($empresa) . "</td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;'><strong>E-mail:</strong></td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0284c7;'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></td>
        </tr>
        <tr>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #64748b;'><strong>Telefone / Whats:</strong></td>
          <td style='padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #16a34a; font-weight: bold;'>" . htmlspecialchars($telefone) . "</td>
        </tr>
        <tr>
          <td style='padding: 12px 0 6px 0; color: #64748b;' colspan='2'><strong>Código da Peça / Descrição da Aplicação:</strong></td>
        </tr>
        <tr>
          <td colspan='2' style='background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 13px; color: #334155; white-space: pre-wrap;'>" . nl2br(htmlspecialchars($descricao)) . "</td>
        </tr>
      </table>
    </div>
    <div style='background-color: #f8fafc; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;'>
      Amilvix Automação e Instrumentação Industrial Ltda. • Vitória - ES
    </div>
  </div>
</body>
</html>
";

$headers = [];
$headers[] = "MIME-Version: 1.0";
$headers[] = "Content-type: text/html; charset=UTF-8";
$headers[] = "From: Amilvix Automação <smtp@amilvix.com.br>";
$headers[] = "Reply-To: " . $email;
$headers[] = "X-Mailer: PHP/" . phpversion();

$mailSent = @mail($to, $subject, $html, implode("\r\n", $headers));

if ($mailSent) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "Cotação enviada com sucesso para vendas@amilvix.com.br via PHP Mail!",
        "protocolo" => $protocolo
    ]);
} else {
    // Retorna 200 para permitir fallback caso o servidor nativo falhe
    http_response_code(200);
    echo json_encode([
        "success" => false,
        "error" => "Falha no envio nativo PHP mail.",
        "protocolo" => $protocolo
    ]);
}
