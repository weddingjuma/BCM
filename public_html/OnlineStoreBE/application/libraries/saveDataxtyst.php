<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class saveDataxtyst  {

    public function encryptAllData_get($plain_text) {

        $this->load->library('encrypt');
        return $ciphertext = $this->encryption->encrypt($plain_text);


        // echo $this->encryption->decrypt($ciphertext);
    }

}
