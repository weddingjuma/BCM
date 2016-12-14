<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Email_Controller
 *
 * @author Admin
 */
class Email_Controller extends REST_Controller {

    
    public function __construct() {
       // parent::__construct();
    }
    public function sendMail_get($status,$sendTo) {
        $config['useragent'] = 'CodeIgniter';
        $config['protocol'] = 'smtp';
        $config['smtp_host'] = 'ssl://smtp.googlemail.com';
        $config['smtp_user'] = 'osoromichael@gmail.com'; // Your gmail id
        $config['smtp_pass'] = 'warrior1989'; // Your gmail Password
        $config['smtp_port'] = 465;
        $config['wordwrap'] = TRUE;
        $config['wrapchars'] = 76;
        $config['mailtype'] = 'html';
        $config['charset'] = 'iso-8859-1';
        $config['validate'] = FALSE;
        $config['priority'] = 3;
        $config['newline'] = "\r\n";
        $config['crlf'] = "\r\n";
       
        
        $this->email->initialize($config);

        $this->email->from('osoromichael@gmail.com', 'Flex Communications');
        $this->email->to($sendTo);
        if ($status['sendCopyToCC']==1) {
            $this->email->cc('okarmikell@gmail.com');
        }
        $this->email->subject('Email Test with pdf');
        $this->email->message('Testing the email class.');
        $pdfPath = $_SERVER["DOCUMENT_ROOT"] . 'pdf/KZZ.pdf';

        $this->email->attach($pdfPath);

        if ($this->email->send()) {
            return true;
        } else {
            return show_error($this->email->print_debugger());
        }
    }

    public function testUrl() {
        echo $_SERVER["DOCUMENT_ROOT"] . 'pdf/';
    }

}
