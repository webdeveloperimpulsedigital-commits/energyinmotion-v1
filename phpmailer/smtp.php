<?php
use PHPMailer\PHPMailer\PHPMailer;

// PHP 8+ compatibility shim for PHPMailer 6.0.x (FILTER_FLAG_HOST_REQUIRED was removed in PHP 8.0)
if (!defined('FILTER_FLAG_HOST_REQUIRED')) {
	define('FILTER_FLAG_HOST_REQUIRED', 0);
}

date_default_timezone_set('Etc/UTC');
require 'autoload.php';

function sendmsg_function($to_mail, $subject, $mailcontent, $adminemail, $adminname, $to_cc = array(), $tmp_arr_file = array(), $reply_to = '', $reply_name = '')
{
	$mail = new PHPMailer;
	$mail->isSMTP();
	$mail->SMTPDebug = 0;

	$mail->SMTPOptions = array(
		'ssl' => array(
			'verify_peer'       => false,
			'verify_peer_name'  => false,
			'allow_self_signed' => true
		)
	);

	$mail->Host        = 'smtp.office365.com'; //hostname
	$mail->CharSet     = 'UTF-8';
	$mail->Port        = 587;
	$mail->SMTPAuth    = true;
	$mail->Username    = 'contactform@energyinmotion.in'; //username
	$mail->Password    = 'X%502657433921uc'; //password
	$mail->Debugoutput = 'html';
	$mail->SMTPSecure  = 'tls';

	// Set who the message is to be sent from
	$mail->setFrom($adminemail, $adminname);

	if (!empty($reply_to) && filter_var($reply_to, FILTER_VALIDATE_EMAIL)) {
		$mail->addReplyTo($reply_to, $reply_name ?: $reply_to);
	}

	if (is_array($to_mail)) {
		foreach ($to_mail as $toemail) {
			if (!empty(trim($toemail))) {
				$mail->addAddress(trim($toemail), trim($toemail));
			}
		}
	} elseif (!empty(trim($to_mail))) {
		$mail->addAddress(trim($to_mail), trim($to_mail));
	}

	if (is_array($to_cc)) {
		foreach ($to_cc as $email) {
			if (!empty(trim($email))) {
				$mail->AddCC(trim($email));
			}
		}
	}

	$mail->Subject = $subject;

	if (is_array($tmp_arr_file) && count($tmp_arr_file) > 0) {
		foreach ($tmp_arr_file as $attachment_file) {
			if (!empty($attachment_file) && file_exists($attachment_file)) {
				$mail->AddAttachment($attachment_file);
			}
		}
	}

	$mail->Body    = $mailcontent;
	$mail->AltBody = strip_tags(str_replace(array('<br>', '<br/>', '<br />', '</tr>'), "\n", $mailcontent));
	$mail->IsHTML(true);

	try {
		if (!$mail->send()) {
			error_log('EIM Mailer Error: ' . $mail->ErrorInfo);
			echo 'Mailer Error: ' . htmlspecialchars($mail->ErrorInfo, ENT_QUOTES, 'UTF-8');
			exit;
		}
	} catch (\Throwable $e) {
		error_log('EIM Mailer Exception: ' . $e->getMessage());
		echo 'Mailer Error: ' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8');
		exit;
	}
}

// file upload
function check_file($form_file)
{
	if (!empty($_FILES[$form_file])) {
		if ($_FILES[$form_file]['error'] > 0) {
			$error_msg = "Error uploading file";
			header("Location:fileupload-error.html");
		} else {
			$root_path  = dirname(__FILE__);
			$ds         = DIRECTORY_SEPARATOR;
			$upload_dir = $root_path . $ds . "upload" . $ds;
			$allowed_extensions = "doc,docx,pdf,txt,xls,odt,ods";
			$file_type  = explode(",", $allowed_extensions);
			$file_size  = 5000000;
			$n          = strrpos($_FILES[$form_file]['name'], '.');
			$user_file_type = substr($_FILES[$form_file]['name'], $n + 1, 4);

			if (!in_array(strtolower($user_file_type), $file_type)) {
				$error_msg = 'The files with extension ' . $user_file_type . ' are not allowed to upload';
				header("Location:fileupload-error.html");
				exit;
			}

			if (is_dir($upload_dir)) {
				$status = TRUE;
			} else {
				if (!mkdir($upload_dir)) {
					$status = FALSE;
				} else {
					if (!chmod($upload_dir, 0777)) {
						$status = FALSE;
					} else {
						$status = TRUE;
					}
				}
			}

			if (!$status) {
				$error_msg = "Directory could not be created";
				header("Location:fileupload-error.html");
				exit;
			}

			$tmp_file_name = $_FILES[$form_file]['name'];
			if (file_exists($upload_dir . $tmp_file_name)) {
				$path_parts        = pathinfo($upload_dir . $tmp_file_name);
				$tmp_file_name_new = $path_parts['filename'];
				$tmp_file_name_ext = $path_parts['extension'];
				$tmp_file_name     = $tmp_file_name_new . '.' . $tmp_file_name_ext;
			}

			if (!($_FILES[$form_file]['size'] > $file_size)) {
				if (move_uploaded_file($_FILES[$form_file]['tmp_name'], $upload_dir . $tmp_file_name)) {
					return $upload_dir . $tmp_file_name;
				} else {
					$error_msg = "File could not be uploaded";
					header("Location:fileupload-error.html");
					exit;
				}
			} else {
				$error_msg = "File size exceeds the maximum file size. Could not be upload";
				header("Location:fileupload-error.html");
				exit;
			}
		}
	} else {
		$error_msg = "File not uploaded";
		header("Location:fileupload-error.html");
		exit;
	}
}
?>
