<?php
session_start();
ini_set("display_errors", FALSE);
ini_set('display_errors', 'Off');
$var = rtrim(dirname(str_replace(array('"', '<', '>', "'", 'blog'), '', $_SERVER["PHP_SELF"])), '/\\');
$siteurl = 'http://' . $_SERVER['HTTP_HOST'] . $var . '/';
define('SITE_PATH', $siteurl);
include dirname(__FILE__) . DIRECTORY_SEPARATOR . 'phpmailer' . DIRECTORY_SEPARATOR . "smtp.php";

// reCAPTCHA Enterprise verification
$serviceAccountPath = '/home2/energyinmotion/keys/energyinmotion-481708-eb0d1fa8ffd6.json';
$token = $_POST['g-recaptcha-response'] ?? '';

if (!empty($token)) {
	$accessToken = getAccessToken($serviceAccountPath);
	$isValid = !empty($accessToken) && verify_captcha($token, $accessToken);

	if (!empty($_POST['frmname']) && $isValid) {
		$frmname    = htmlspecialchars(trim($_POST['frmname'] ?? ''), ENT_QUOTES, 'UTF-8');
		$frmlast    = htmlspecialchars(trim($_POST['frmlast'] ?? ''), ENT_QUOTES, 'UTF-8');
		$frmemail   = filter_var(trim($_POST['frmemail'] ?? ''), FILTER_SANITIZE_EMAIL);
		$frmcontact = htmlspecialchars(trim($_POST['frmcontact'] ?? ''), ENT_QUOTES, 'UTF-8');
		$frmdes     = nl2br(htmlspecialchars(trim($_POST['frmdes'] ?? ''), ENT_QUOTES, 'UTF-8'));

		$tmp_sub = "EIM - Contact Us";
		$message = "<table border='0' cellspacing='0' cellpadding='8' width='80%' style='border-collapse:collapse;'>" .
			"<tr><td colspan='2' style='padding-bottom:12px;'><font face='Verdana' size='3' color='#01262D'><b><div align='center'>EIM - Contact Us</div></b></font></td></tr>" .
			"<tr><td width='33%'><font face='Verdana' size='2' color='#3A4368'><b>First Name</b></font></td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>{$frmname}</font></td></tr>" .
			"<tr><td width='33%'><font face='Verdana' size='2' color='#3A4368'><b>Last Name</b></font></td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>{$frmlast}</font></td></tr>" .
			"<tr><td width='33%'><font face='Verdana' size='2' color='#3A4368'><b>Email Address</b></font></td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>{$frmemail}</font></td></tr>" .
			"<tr><td width='33%'><font face='Verdana' size='2' color='#3A4368'><b>Mobile Number</b></font></td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>{$frmcontact}</font></td></tr>" .
			"<tr><td width='33%' valign='top'><font face='Verdana' size='2' color='#3A4368'><b>Your Message</b></font></td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>{$frmdes}</font></td></tr>" .
			"</table><br>";

		// Lead recipients (remove tushar@theimpulsedigital.com after testing if no longer needed)
		$tmp_arr_to = array(
			"rajiv.singh@energyinmotion.in",
			"powerup@energyinmotion.in",
			"tushar@theimpulsedigital.com"
		);
		$tmp_cc_array = array();
		$tmp_arr_file = array();
		$adminemail   = 'contactform@energyinmotion.in';
		$adminname    = 'Energy In Motion Website';

		sendmsg_function($tmp_arr_to, $tmp_sub, $message, $adminemail, $adminname, $tmp_cc_array, $tmp_arr_file, $frmemail, trim($frmname . ' ' . $frmlast));

		if (count($tmp_arr_file) > 0) {
			foreach ($tmp_arr_file as $tmpfile) {
				if (file_exists($tmpfile)) {
					unlink($tmpfile);
				}
			}
		}

		header("Location: thank-you.html");
		exit;
	} else {
		header("Location: error-captcha.html");
		exit;
	}
} else {
	header("Location: error-captcha.html");
	exit;
}

function base64url_encode($data) {
	return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function verify_captcha($token, $accessToken) {
	$projectId = 'energyinmotion-481708';
	$siteKey   = '6Lf4XDAsAAAAAOfHRvkeWz_Q-YEXwYRV0NDyBhnH';
	$url = "https://recaptchaenterprise.googleapis.com/v1/projects/" . $projectId . "/assessments";
	$data = [
		"event" => [
			"token"   => $token,
			"siteKey" => $siteKey
		]
	];

	$ch = curl_init($url);
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_POST           => true,
		CURLOPT_HTTPHEADER     => [
			"Authorization: Bearer $accessToken",
			"Content-Type: application/json"
		],
		CURLOPT_POSTFIELDS     => json_encode($data),
		CURLOPT_TIMEOUT        => 15
	]);

	$response = curl_exec($ch);
	curl_close($ch);
	$result = json_decode($response, true);

	return isset($result['tokenProperties']['valid']) && $result['tokenProperties']['valid'] === true;
}

function getAccessToken($serviceAccountPath) {
	if (!file_exists($serviceAccountPath) || !is_readable($serviceAccountPath)) {
		error_log('EIM Contact Form: Service account JSON not found or unreadable at ' . $serviceAccountPath);
		return null;
	}
	if (!function_exists('openssl_sign') || !function_exists('curl_init')) {
		error_log('EIM Contact Form: Missing openssl or curl PHP extension.');
		return null;
	}

	$jsonKey = json_decode(file_get_contents($serviceAccountPath), true);
	if (empty($jsonKey['client_email']) || empty($jsonKey['private_key'])) {
		error_log('EIM Contact Form: Invalid service account JSON structure.');
		return null;
	}

	$jwtHeader = base64url_encode(json_encode([
		"alg" => "RS256",
		"typ" => "JWT"
	]));

	$now = time();
	$jwtClaim = base64url_encode(json_encode([
		"iss"   => $jsonKey['client_email'],
		"scope" => "https://www.googleapis.com/auth/cloud-platform",
		"aud"   => "https://oauth2.googleapis.com/token",
		"iat"   => $now,
		"exp"   => $now + 3600
	]));

	$signatureInput = $jwtHeader . "." . $jwtClaim;
	if (!openssl_sign($signatureInput, $signature, $jsonKey['private_key'], 'sha256')) {
		return null;
	}
	$jwt = $signatureInput . "." . base64url_encode($signature);

	$post = http_build_query([
		'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
		'assertion'  => $jwt
	]);

	$ch = curl_init("https://oauth2.googleapis.com/token");
	curl_setopt_array($ch, [
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_POST           => true,
		CURLOPT_POSTFIELDS     => $post,
		CURLOPT_TIMEOUT        => 15
	]);

	$response = json_decode(curl_exec($ch), true);
	curl_close($ch);

	return $response['access_token'] ?? null;
}
?>
