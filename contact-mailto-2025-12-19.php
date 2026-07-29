<?php
session_start();
ini_set("display_errors",false);
$var =  rtrim(dirname(str_replace(array('"', '<', '>', "'",'blog'), '', $_SERVER["PHP_SELF"])), '/\\');
$siteurl = 'http://'.$_SERVER['HTTP_HOST'].$var.'/';
define('SITE_PATH',$siteurl);
include dirname(__FILE__).DIRECTORY_SEPARATOR.'phpmailer'.DIRECTORY_SEPARATOR."smtp.php";

if(isset($_POST['g-recaptcha-response']) && !empty($_POST['g-recaptcha-response']))
{ 

$secret = "6LdYFpQqAAAAAPxQaYjX6HbK-3QbB6nN8agpphs5";
$verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$_POST['g-recaptcha-response']);
$responseData = json_decode($verifyResponse);
if((!empty($_POST['frmname'])) && ($responseData->success)) 
{ 	

$frmname	=	$_POST['frmname'];
$frmemail	=	$_POST['frmemail'];
$frmcontact	=	$_POST['frmcontact'];
$frmlast	=	$_POST['frmlast'];
$frmdes	=	$_POST['frmdes'];

	
		$tmp_sub  = "EIM - Contact Us";
		$submsg = '';
		$message ="<table border='0' cellspacing='0' cellpadding='0' width='80%'>".
		"<tr><td colspan='2'><font face='Verdana' size='3' color='black'><b><div align='center'>EIM - Contact Us</div></b></font></td></tr>".
		"<tr><td width='33%'><font face='Verdana' size='2' color='#3A4368'><b>"."<font face='Verdana' size='2' color='#000000'>"."<b>"."</b></font>First Name</b></font><font face='Verdana' size='2' color='#000000'><b>"."</b>"."</font>"."</td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>"."$frmname"."</font></td></tr>".
		
		"<tr><td width='33%'><font face='Verdana' size='2' color='#3A4368'><b>"."<font face='Verdana' size='2' color='#000000'>"."<b>"."</b></font>Last Name</b></font><font face='Verdana' size='2' color='#000000'><b>"."</b>"."</font>"."</td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>"."$frmlast"."</font></td></tr>".
		
		"<tr><td width='33%'><font face='Verdana' size='2' color='#3A4368'><b>"."<font face='Verdana' size='2' color='#000000'>"."<b>"."</b></font>Email Address</b></font><font face='Verdana' size='2' color='#000000'><b>"."</b>"."</font>"."</td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>"."$frmemail"."</font></td></tr>".
		"<tr><td width='33%'><font face='Verdana' size='2' color='#3A4368'><b>"."<font face='Verdana' size='2' color='#000000'>"."<b>"."</b></font>Mobile Number</b></font><font face='Verdana' size='2' color='#000000'><b>"."</b>"."</font>"."</td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>"."$frmcontact"."</font></td></tr>".
		
		
		"<tr><td width='33%'><font face='Verdana' size='2' color='#3A4368'><b>"."<font face='Verdana' size='2' color='#000000'>"."<b>"."</b></font>Your Message</b></font><font face='Verdana' size='2' color='#000000'><b>"."</b>"."</font>"."</td><td width='67%'><font face='Verdana' size='2' color='#0556BF'>"."$frmdes"."</font></td></tr>".
		"</table>".			
		"<br>";
				
		$tmp_arr_file = array();

		if(!($_FILES['file']['size']==0))
		{
			$tmp_arr_file[] = check_file('file');
		}
		          $tmp_arr_to  	= array("rajiv.singh@energyinmotion.in");
		//$tmp_arr_to  	= array("powerup@energyinmotion.in");
		$tmp_cc_array 	= array("");
		$tmp_arr_file 	= array();
		$adminemail 	= 'contactform@energyinmotion.in';
		$adminname  	= 'Admin';
		
		$tmp_str_ret = sendmsg_function($tmp_arr_to, $tmp_sub, $message, $adminemail,$adminname,$tmp_cc_array,$tmp_arr_file); //function to send mail
		
				if(count($tmp_arr_file) > 0)
		{
			foreach($tmp_arr_file as $tmpfile)
			{
				unlink($tmpfile);
			}
		}
		
		header("Location:thank-you.html");				
	}
}

else{ header("Location:error-captcha.html");}
exit;
?>
