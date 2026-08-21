<?php
/**
 * Energy In Motion - Dedicated Lead & Enquiry Mail Handler
 * Landing Page: new-landing-page
 */

session_start();
ini_set("display_errors", FALSE);
ini_set('display_errors', 'Off');
error_reporting(0);

// Set CORS headers for AJAX/fetch requests
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 1. Include PHPMailer SMTP handler
$smtp_file = dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'phpmailer' . DIRECTORY_SEPARATOR . 'smtp.php';
if (file_exists($smtp_file)) {
    include_once $smtp_file;
}

// 2. Parse Incoming Request (supports JSON payload, FormData, and standard $_POST)
$raw_input = file_get_contents('php://input');
$json_data = json_decode($raw_input, true);

$data = array();
if (is_array($json_data)) {
    $data = $json_data;
} else {
    $data = $_POST;
}

// Extract form fields with fallbacks for Hero form and Final form
$name        = trim($data['name'] ?? $data['name2'] ?? $data['frmname'] ?? '');
$company     = trim($data['company'] ?? $data['company2'] ?? $data['frmcompany'] ?? '');
$email       = trim($data['email'] ?? $data['email2'] ?? $data['frmemail'] ?? '');
$mobile      = trim($data['mobile'] ?? $data['mobile2'] ?? $data['frmcontact'] ?? '');
$interest    = trim($data['interest'] ?? $data['requirement'] ?? $data['frminterest'] ?? 'Electric Heavy-Duty Trucks / Fleet Electrification');
$details     = trim($data['details'] ?? $data['details2'] ?? $data['frmdes'] ?? '');
$form_source = trim($data['which'] ?? 'New Landing Page Form');
$timestamp   = date('d M Y, h:i A T');

// Validate mandatory fields
if (empty($name) && empty($email) && empty($mobile)) {
    $is_ajax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
               || !empty($json_data) 
               || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);
    
    if ($is_ajax) {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Please fill in all required fields.']);
        exit;
    } else {
        header("Location: index.html");
        exit;
    }
}

// 3. Configure Recipient Email Addresses
// Add your client email(s) below:
$recipient_emails = array(
    "powerup@energyinmotion.in",
    "rajiv.singh@energyinmotion.in"
);

// Optional CC Emails (add if required)
$cc_emails = array();

// 4. Construct Branded HTML Email Template
$subject = "EIM New Lead: " . (!empty($name) ? $name : 'Fleet Requirement') . " - " . (!empty($company) ? $company : 'New Landing Page');

$mail_content = "
<!DOCTYPE html>
<html>
<head>
<meta charset='UTF-8'>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f7; margin: 0; padding: 20px; color: #01262D; }
  .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #e4eaea; }
  .header { background: #01262D; padding: 24px 30px; text-align: left; border-bottom: 3px solid #38E0CF; }
  .header h1 { margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: -0.02em; }
  .header p { margin: 6px 0 0; color: #38E0CF; font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; font-family: monospace; }
  .content { padding: 28px 30px; }
  .tag { display: inline-block; background: rgba(56,224,207,0.15); color: #01262D; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; border: 1px solid rgba(56,224,207,0.4); }
  .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  .table th, .table td { padding: 12px 14px; text-align: left; font-size: 14px; border-bottom: 1px solid #ebeeee; vertical-align: top; }
  .table th { width: 34%; color: #4A6B70; font-weight: 600; background: #fafbfb; }
  .table td { width: 66%; color: #01262D; font-weight: 500; }
  .highlight { color: #01262D; font-weight: 700; }
  .footer { background: #fafbfb; padding: 16px 30px; font-size: 12px; color: #8AA2A6; border-top: 1px solid #ebeeee; text-align: center; }
</style>
</head>
<body>
<div class='container'>
  <div class='header'>
    <h1>Energy In Motion</h1>
    <p>New Fleet Requirement &middot; New Landing Page</p>
  </div>
  <div class='content'>
    <div class='tag'>New Lead Submission</div>
    <table class='table'>
      <tr>
        <th>Full Name</th>
        <td class='highlight'>" . htmlspecialchars($name) . "</td>
      </tr>
      <tr>
        <th>Company</th>
        <td class='highlight'>" . htmlspecialchars($company) . "</td>
      </tr>
      <tr>
        <th>Work Email</th>
        <td><a href='mailto:" . htmlspecialchars($email) . "' style='color:#01262D;text-decoration:underline;'>" . htmlspecialchars($email) . "</a></td>
      </tr>
      <tr>
        <th>Mobile Number</th>
        <td><a href='tel:" . htmlspecialchars($mobile) . "' style='color:#01262D;text-decoration:none;font-weight:600;'>" . htmlspecialchars($mobile) . "</a></td>
      </tr>
      <tr>
        <th>Primary Requirement</th>
        <td style='color:#01262D;font-weight:600;'>" . htmlspecialchars($interest) . "</td>
      </tr>
      <tr>
        <th>Fleet / Route Details</th>
        <td>" . (!empty($details) ? nl2br(htmlspecialchars($details)) : '<em>No additional details provided</em>') . "</td>
      </tr>
      <tr>
        <th>Form Section</th>
        <td>" . htmlspecialchars($form_source) . "</td>
      </tr>
      <tr>
        <th>Submission Time</th>
        <td>" . htmlspecialchars($timestamp) . "</td>
      </tr>
    </table>
  </div>
  <div class='footer'>
    This enquiry was submitted from the Energy In Motion new landing page (<code>/new-landing-page/</code>).
  </div>
</div>
</body>
</html>
";

$adminemail = 'contactform@energyinmotion.in';
$adminname  = 'Energy In Motion Leads';
$mail_sent  = false;

// 5. Send via sendmsg_function if available
if (function_exists('sendmsg_function')) {
    $mail_sent = sendmsg_function($recipient_emails, $subject, $mail_content, $adminemail, $adminname, $cc_emails, array());
} else {
    // Fallback standard PHP mail()
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . $adminname . " <" . $adminemail . ">\r\n";
    $headers .= "Reply-To: " . (!empty($email) ? $email : $adminemail) . "\r\n";
    if (!empty($cc_emails)) {
        $headers .= "Cc: " . implode(',', $cc_emails) . "\r\n";
    }
    $to_str = implode(',', $recipient_emails);
    $mail_sent = mail($to_str, $subject, $mail_content, $headers);
}

// 6. Return Response
$is_ajax = (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest') 
           || !empty($json_data) 
           || (isset($_SERVER['HTTP_ACCEPT']) && strpos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false);

if ($is_ajax) {
    header('Content-Type: application/json');
    echo json_encode([
        'status'  => 'success',
        'message' => 'Thank you. We have received your requirement.'
    ]);
    exit;
} else {
    header("Location: thank-you.html");
    exit;
}
?>
