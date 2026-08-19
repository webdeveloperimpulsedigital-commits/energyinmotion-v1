<?php
session_start();
ini_set("display_errors",FALSE);
ini_set('display_errors', 'Off');
$var =  rtrim(dirname(str_replace(array('"', '<', '>', "'",'blog'), '', $_SERVER["PHP_SELF"])), '/\\');
$siteurl = 'http://'.$_SERVER['HTTP_HOST'].$var.'/';
define('SITE_PATH',$siteurl);
include dirname(__FILE__).DIRECTORY_SEPARATOR.'phpmailer'.DIRECTORY_SEPARATOR."smtp.php";


//Add Code for captcha verification
//echo 'testttt'; exit;
    $serviceAccountPath = '/home2/energyinmotion/keys/energyinmotion-481708-eb0d1fa8ffd6.json';
    $token = $_POST['g-recaptcha-response'] ?? '';
    if(isset($_POST['g-recaptcha-response']) && !empty($_POST['g-recaptcha-response'])){
    $token = $_POST['g-recaptcha-response'];
    $accessToken = getAccessToken($serviceAccountPath);
    $isValid = verify_captcha($token,$accessToken);
    // echo $isValid;exit;
//Add Code for captcha verification also add isValid in below if condition

if(!empty($_POST['frmname'])) 
{
	$frmname	=	$_POST['frmname'] ?? '';
	$frmcompany	=	$_POST['frmcompany'] ?? '';
	$frmemail	=	$_POST['frmemail'] ?? '';
	$frmcontact	=	$_POST['frmcontact'] ?? '';
	$frminterest =	$_POST['frminterest'] ?? '';
	$frmdes	    =	$_POST['frmdes'] ?? '';

		$tmp_sub  = "EIM - Heavy Fleet Requirement: " . $frmname;
		$submsg = '';
		$message ="<table border='0' cellspacing='0' cellpadding='8' width='100%' style='font-family: Arial, sans-serif; font-size: 14px;'>".
		"<tr bgcolor='#01262D'><td colspan='2'><font color='#38E0CF'><b><div style='font-size: 16px; padding: 6px 0;'>Energy In Motion — New Fleet Requirement Lead</div></b></font></td></tr>".
		"<tr><td width='30%' bgcolor='#f4f9f9'><b>Full Name:</b></td><td width='70%'>" . htmlspecialchars($frmname) . "</td></tr>".
		"<tr><td width='30%' bgcolor='#f4f9f9'><b>Company:</b></td><td width='70%'>" . htmlspecialchars($frmcompany) . "</td></tr>".
		"<tr><td width='30%' bgcolor='#f4f9f9'><b>Work Email:</b></td><td width='70%'>" . htmlspecialchars($frmemail) . "</td></tr>".
		"<tr><td width='30%' bgcolor='#f4f9f9'><b>Mobile Number:</b></td><td width='70%'>" . htmlspecialchars($frmcontact) . "</td></tr>".
		"<tr><td width='30%' bgcolor='#f4f9f9'><b>Interested In / Primary Requirement:</b></td><td width='70%'><font color='#04363F'><b>" . htmlspecialchars($frminterest) . "</b></font></td></tr>".
		"<tr><td width='30%' bgcolor='#f4f9f9'><b>Fleet / Route Details:</b></td><td width='70%'>" . nl2br(htmlspecialchars($frmdes)) . "</td></tr>".
		"</table><br>";
				
	 
		
		
		//$tmp_arr_to  	= array("rajiv.singh@energyinmotion.in");
		$tmp_arr_to  	= array("tester7705@gmail.com");
		$tmp_arr_file 	= array();
		$adminemail 	= 'contactform@energyinmotion.in';
		$adminname  	= 'Admin';
		
		$tmp_str_ret = sendmsg_function($tmp_arr_to, $tmp_sub, $message, $adminemail,$adminname,$tmp_cc_array,$tmp_arr_file); //function to send mail
		
		if(count($tmp_arr_file) > 0)
		{
		    echo 'in if';exit;
			foreach($tmp_arr_file as $tmpfile)
			{
				unlink($tmpfile);
			}
		}
		///	echo 'reach here 123';exit;
	//	ob_end_clean();
		header("Location:thank-you.html");
				
	}
}

else{ header("Location:error-captcha.html");}
// Add Below captcha methods and update $projectId and $siteKey

function verify_captcha($token,$accessToken){
    $projectId = 'energyinmotion-481708';
    $siteKey   = '6Lf4XDAsAAAAAOfHRvkeWz_Q-YEXwYRV0NDyBhnH';
    $url = "https://recaptchaenterprise.googleapis.com/v1/projects/".$projectId."/assessments";
    $data = [
        "event" => [
            "token"   => $token,
            "siteKey"=> $siteKey
        ]
    ];
    
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $accessToken",
            "Content-Type: application/json"
        ],
        CURLOPT_POSTFIELDS => json_encode($data)
    ]);
    
    $response = curl_exec($ch);
    curl_close($ch);
    $result = json_decode($response, true);
     // print_r($result);exit;
    //echo "<pre>";print_r(json_decode($response, true));exit;
    if(isset($result['tokenProperties']['valid']) && $result['tokenProperties']['valid'] === true){
        return true;
    }else{
        return false;
    }
}
function getAccessToken($serviceAccountPath){
    $jsonKey = json_decode(file_get_contents($serviceAccountPath), true);

    $jwtHeader = base64_encode(json_encode([
        "alg" => "RS256",
        "typ" => "JWT"
    ]));

    $now = time();
    $jwtClaim = base64_encode(json_encode([
        "iss"   => $jsonKey['client_email'],
        "scope" => "https://www.googleapis.com/auth/cloud-platform",
        "aud"   => "https://oauth2.googleapis.com/token",
        "iat"   => $now,
        "exp"   => $now + 3600
    ]));

    $signatureInput = $jwtHeader . "." . $jwtClaim;
    openssl_sign($signatureInput, $signature, $jsonKey['private_key'], 'sha256');
    $jwt = $signatureInput . "." . base64_encode($signature);

    $post = http_build_query([
        'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion'  => $jwt
    ]);

    $ch = curl_init("https://oauth2.googleapis.com/token");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $post
    ]);

    $response = json_decode(curl_exec($ch), true);
    curl_close($ch);

    return $response['access_token'] ?? null;
}

exit;
?>
