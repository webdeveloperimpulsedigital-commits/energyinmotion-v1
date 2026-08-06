<?php 
use PHPMailer\PHPMailer\PHPMailer;

date_default_timezone_set('Etc/UTC');
require 'autoload.php';

function sendmsg_function($to_mail, $subject, $mailcontent, $adminemail,$adminname,$to_cc,$tmp_arr_file)
{
		$mail = new PHPMailer;
		$mail->isSMTP();
		$mail->SMTPDebug = 0;
		
		$mail->SMTPOptions = array(
			'ssl' => array(
				'verify_peer' => false,
				'verify_peer_name' => false,
				'allow_self_signed' => true
			)
		);
		


		$mail->Host = 'smtp.office365.com'; //hostname
		$mail->CharSet = 'UTF-8';
		$mail->Port = 587;
		$mail->SMTPAuth = true;
		$mail->Username = 'contactform@energyinmotion.in';  //username
		$mail->Password = 'X%502657433921uc';  //password
		$mail->Debugoutput 	= 'html';
		$mail->SMTPSecure = '';

		$mail->SMTPSecure = '';

		//Set who the message is to be sent from
		$mail->setFrom($adminemail,$adminname);
		
		if(is_array($to_mail))
		{
			foreach($to_mail as $toemail)
			{
				$mail->addAddress($toemail,$toemail);
			}
		}
		else
		{
			$mail->addAddress($to_mail,$to_mail);
		}
		
		foreach($to_cc as $email)
		{
		   $mail->AddCC($email);
		}

		$mail->Subject =mb_encode_mimeheader($subject,"UTF-8", "B", "\n");

		if($tmp_arr_file)
		{
			
			foreach($tmp_arr_file as $tmp_arr_file)
			{
			  $mail->AddAttachment($tmp_arr_file); 	#Add attachment(s)
			}
         }

		$mail->Body    = $mailcontent;
		$mail->AltBody = '';
		$mail->IsHTML(true);
		//$mail->send(); 
		if (!$mail->send()) {
		    echo 'Mailer Error: ' . $mail->ErrorInfo; exit;
		} else {
		    //echo 'Message sent!'; 
		}
}

//file upload
function check_file($form_file)
{	
	//check for any error
	 if(!empty($_FILES[$form_file]))
	 {
		if($_FILES[$form_file]['error']>0)
		{
			$error_msg="Error uploading file";
			header("Location:fileupload-error.html");
	    }
		else
	    {
			$root_path = dirname(__FILE__);
			$ds = DIRECTORY_SEPARATOR;
			$upload_dir=$root_path.$ds."upload".$ds; //specify directory name where the file gets uploaded
			//only files with these extensions get upload
			$allowed_extensions="doc,docx,pdf,txt,xls,odt,ods"; 
			$file_type=explode(",",$allowed_extensions);
			//specify max. size of file in bytes
			$file_size=5000000;
			//extracting extensions from file name
			$n=strrpos($_FILES[$form_file]['name'],'.');
			$user_file_type=substr($_FILES[$form_file]['name'],$n+1,4);
			//echo $user_file_type;
			if(!in_array(strtolower($user_file_type),$file_type))
			{
				//die('The files with extension '.$user_file_type.' are not allowed to upload');
				$error_msg='The files with extension '.$user_file_type.' are not allowed to upload';
				header("Location:fileupload-error.html");
				exit;
			}
			
			//check if it is a directory and if not then directory is created
			if(is_dir($upload_dir))
			{
				$status=TRUE;
			}
			else
			{
				if(!mkdir($upload_dir))
				{
	               $status=FALSE;
				}
				else
				{
					if(!chmod($upload_dir,0777))
					{
	                    $status=FALSE;
					}
					else
					{
	                    $status=TRUE;
	                }
				}
			}

			if(!$status)
			{
	          //die("Directory could not be created");
	          $error_msg="Directory could not be created";
	          header("Location:fileupload-error.html");
	          exit;
			}
			
			$tmp_file_name = $_FILES[$form_file]['name'];
			
			//check if the file already exists in (upload) directory
			if(file_exists($upload_dir.$tmp_file_name))
			{
				// if yes then update the name of the file
				$path_parts = pathinfo($upload_dir.$tmp_file_name);
				$tmp_file_name_new = $path_parts['filename'];
				$tmp_file_name_ext = $path_parts['extension'];
				$tmp_file_name = $tmp_file_name_new.'.'.$tmp_file_name_ext;
			}	 
			
			if(!($_FILES[$form_file]['size'] > $file_size))
			{
				//move the temporary file to the specified directory
				if(move_uploaded_file($_FILES[$form_file]['tmp_name'],$upload_dir.$tmp_file_name))
				{
					return $upload_dir.$tmp_file_name;
				}
				else
				{
					//echo "File could not be uploaded";
					$error_msg="File could not be uploaded";
					header("Location:fileupload-error.html");
					exit;
				}
			}
			else
			{
			   //echo "File size exceeds the maximum file size. Could not be upload.";
			   $error_msg="File size exceeds the maximum file size. Could not be upload";
			   header("Location:fileupload-error.html");
			   exit;
			}
			
		}
	}
	else
	{
	  //File not uploaded
	  $error_msg="File not uploaded";
	  header("Location:fileupload-error.html");
	  exit;
	}
}
?>
