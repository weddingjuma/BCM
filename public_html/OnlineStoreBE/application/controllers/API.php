<?php

header("Access-Control-Allow-Origin: *");
defined('BASEPATH') OR exit('No direct script access allowed');
require APPPATH . 'libraries/REST_Controller.php';

class API extends REST_Controller {

    function __construct() {
        parent::__construct();
        $this->load->library('Format');
    }

    public function file_force_contents($filename, $data) {
        if (!is_dir(dirname($filename)))
            mkdir(dirname($filename) . '/', 0777, TRUE);
        return file_put_contents($filename, $data, FILE_APPEND);
    }

    public function folderName_get() {
        echo base_url();
    }

    public function get_client_ip() {
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if (isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if (isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if (isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if (isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if (isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }

    public function saveExceptionToFile_post() {
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $error = $request->exceptionError;

        $error = unix_to_human(time()) . ' : ' . $error . '. Machine IP -' . $this->get_client_ip() . PHP_EOL; // $request->exception;
        if (isset($error)) {
            try {
                $fname = "errorLogs/exceptionFile.txt"; //generates random name
// $file = fopen($fname, 'w'); //creates new file
                $this->file_force_contents($fname, $error);
                $this->response(array('message' => 'Log files written successfully', 'status' => '1', 'status_info' => 'error log success'));
            } catch (Exception $e) {
                echo $e->getMessage();
            }
        }
    }

    public function onlineTiming_get($time) {
        $returnArray = [];
        $returnArray['online'] = 0;
        if ($time > 0) {
            $difTime = time() - $time;
            if ($difTime < 10) {
                $returnArray['lastSeen'] = 'now';
                $returnArray['online'] = 1;
            }
            if ($difTime > 10 && $difTime < 60) {
                $returnArray['lastSeen'] = $difTime . ' secs ago';
            }
            if ($difTime > 60 && $difTime < 3600) {
                $difTime = round($difTime / (60), 0);
                $returnArray['lastSeen'] = $difTime . ' mins ago';
            }
            if ($difTime > 3600 && $difTime < 3600 * 24) {
                $difTime = round($difTime / (60 * 60), 0);
                $returnArray['lastSeen'] = $difTime . ' hours ago';
            }
            if ($difTime > (3600 * 24) && $difTime < (3600 * 24 * 30)) {
                $difTime = round($difTime / (24 * 60 * 60), 0);
                $returnArray['lastSeen'] = $difTime . ' days ago';
            }
            if ($difTime > (3600 * 24 * 30) && $difTime < (3600 * 24 * 30 * 12)) {
                $difTime = round($difTime / (24 * 60 * 60), 0);
                $returnArray['lastSeen'] = $difTime . ' Mons ago';
            }
        }

        return $returnArray;
    }

    function randomSign_get($len) {

        $min_lenght = 0;
        $max_lenght = 100;
        $bigL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $smallL = "abcdefghijklmnopqrstuvwxyz0123456789";
        $number = "0123456789";
        $bigB = str_shuffle($bigL);
        $smallS = str_shuffle($smallL);
        $numberS = str_shuffle($number);
        $subA = substr($bigB, 0, 5);
        $subB = substr($bigB, 6, 5);
        $subC = substr($bigB, 10, 5);
        $subD = substr($smallS, 0, 5);
        $subE = substr($smallS, 6, 5);
        $subF = substr($smallS, 10, 5);
        $subG = substr($numberS, 0, 5);
        $subH = substr($numberS, 6, 5);
        $subI = substr($numberS, 10, 5);
        $RandCode1 = str_shuffle($subA . $subD . $subB . $subF . $subC . $subE);
        $RandCode2 = str_shuffle($RandCode1);
        $RandCode = $RandCode1 . $RandCode2;
        if ($len > $min_lenght && $len < $max_lenght) {
            $CodeEX = substr($RandCode, 0, $len);
        } else {
            $CodeEX = $RandCode;
        }
        return $CodeEX;
    }

    private function saveErrorLogs_get($error, $functionName) {
        try {
            $data['errorMessage'] = $error->getMessage();
            $data['functionName'] = $functionName;
            if (isset($data)) {
                $query = $this->Trackers_model->insert_data($data, 'TBL_ERROR_LOGS');
                if (!$query) {

                    exit();
                }
            }
        } catch (Exception $error) {
            
        }
    }

    private function returnJsonObject($jsonObject) {
        try {
            $postedData = [];

            if (isset($jsonObject)) {
                $posted = (array) json_decode($jsonObject);
                if (is_array($postedData)) {
                    $postedData = $posted;
                } else {
                    $postedData['status'] = false;
                }
            }
        } catch (Exception $e) {
            $this->saveErrorLogs_get($e, 'returnJsonObject');
            $postedData['status'] = false;
        }
        return $postedData;
    }

    private function returnMainColumn_get($tableName) {

        $where['tableName'] = $tableName;
        $queryExist = $this->Trackers_model->getAllData($where, 'TBL_COLUMNS_TABLES');
        $column = '';

        if (sizeof($queryExist) > 0) {
            foreach ($queryExist as $key => $value) {
                $column = $value['mainColumn'];
            }
        } else {
            $column = 'dateCreated';
        }
        return $column;
    }

    public function returnWantedFields($data, $dbData) {
        if (sizeof($data) > 0) {
            $tempData = [];
            foreach ($dbData as $key => $value) {
                for ($i = 0; $i < sizeof($data); $i++) {
                    $tempData[$key][$data[$i]] = $value[$data[$i]];
                }
            }
            return $tempData;
        } else {
            return $dbData;
        }
    }

    public function returnArray($where, $tablename) {
        $array = $this->Trackers_model->getAllDataReturnArray($where, $tablename);
        $returnArray = [];
        foreach ($array as $key => $value) {
            $returnArray = $value;
        }
        return $returnArray;
    }

    public function getAllUserDataDeleted_post() {
        try {
            $postData = $this->returnJsonObject(file_get_contents("php://input"));
            $table_name = $postData['table'];
            $where = (array) $postData['data'];
            $whereFinal['status'] = 3;



            $columnsToFetch = $postData['columns'];

            if (isset($where) && is_array($where)) {

                $query = $this->Trackers_model->getAllDataColumns($whereFinal, $table_name, $columnsToFetch);
                if ($table_name == 'TBL_STOCK_RECEIVED') {
                    foreach ($query as $key => $value) {
                        $whereCol['id'] = $value['productId'];
                        $productDetails = $this->returnArray($whereCol, 'TBL_PRODUCTS');
                        $query[$key]['name'] = $productDetails['name'];
                        $query[$key]['code'] = $productDetails['code'];
                    }
                }
                if ($table_name == 'TBL_ORDERS') {
                    foreach ($query as $key => $value) {
                        $whereCol['id'] = $value['customerId'];
                        $cDetails = $this->returnArray($whereCol, 'TBL_CUSTOMERS');
                        $query[$key]['customerName'] = $cDetails;
                    }
                }
                if ($table_name == 'TBL_PRODUCTS' || $table_name == 'TBL_SERVICES') {
                    foreach ($query as $key => $value) {

                        $query[$key]['itemCaseQty'] = 0;
                        $query[$key]['itemPieceQty'] = 1;
                    }
                }



                if (sizeof($query) > 0) {
                    $this->response(array('message' => 'Success : Success fetching Data', 'data' => $query, 'status' => '1', 'status_info' => 'Success'));
                } else {
                    $this->response(array('message' => 'Success :  Not data is available', 'status' => '0', 'status_info' => 'Failure'));
                }
            }
        } catch (Exception $e) {
            
        }
    }

    public function getAllUserData_post() {
        try {
            $postData = $this->returnJsonObject(file_get_contents("php://input"));
            $table_name = $postData['table'];
            $where = (array) $postData['data'];

            // $whereFinal['status <'] = 3;
            if (isset($where)) {
                if (isset($where['dateFrom'])) {
                    $whereFinal['dateCreated >='] = $where['dateFrom'];
                }
                if (isset($where['dateTo'])) {
                    $whereFinal['dateCreated <='] = $where['dateTo'];
                }
                if (isset($where['status'])) {
                    if ($table_name == 'TBL_ORDERS') {
                        $whereFinal['orderStatus'] = $where['status'];
                    } else {
                        $whereFinal['status'] = $where['status'];
                    }
                } else {
                    if ($table_name == 'TBL_ORDERS') {

                        $whereFinal['orderStatus <'] = 5;
                    } else {
                        $whereFinal['status <'] = 3;
                    }
                }
            }
            //  print_r($whereFinal);
            //  exit();
            $columnsToFetch = $postData['columns'];

            if (isset($where) && is_array($where)) {
                if (isset($where['customerId'])) {
                    $whereFinal['customerId'] = $where['customerId'];
                }
                $query = $this->Trackers_model->getAllDataColumns($whereFinal, $table_name, $columnsToFetch);
                if ($table_name == 'TBL_STOCK_RECEIVED') {
                    foreach ($query as $key => $value) {
                        $whereCol['id'] = $value['productId'];
                        $productDetails = $this->returnArray($whereCol, 'TBL_PRODUCTS');
                        $query[$key]['name'] = $productDetails['name'];
                        $query[$key]['code'] = $productDetails['code'];
                    }
                }
                if ($table_name == 'TBL_ORDERS' || $table_name == 'TBL_MPESA_PAYMENTS') {
                    foreach ($query as $key => $value) {
                        $whereCol['id'] = $value['customerId'];
                        $cDetails = $this->returnArray($whereCol, 'TBL_CUSTOMERS');
                        $query[$key]['customerName'] = $cDetails;
                    }
                }

                if ($table_name == 'TBL_PAYMENTS') {
                    foreach ($query as $key => $value) {
                        $whereCol['id'] = $value['customerId'];
                        $cDetails = $this->returnArray($whereCol, 'TBL_CUSTOMERS');
                        $query[$key]['customerName'] = $cDetails;
                        $whereProducts['orderNumber'] = $query[$key]['orderId'];
                        $whereProducts['paidStatus'] = 1;
                        $query[$key]['products'] = '';
                        $products = '';
                        $que = $this->Trackers_model->getAllData($whereProducts, 'TBL_ORDERS');
                        foreach ($que as $k => $val) {
                            $products .= $val['productName'] . '& QTY : ' . $val['qty'] . '<br>';
                        }
                        $query[$key]['products'] = $products;
                    }
                }
                if ($table_name == 'TBL_PRODUCTS') {
                    foreach ($query as $key => $value) {

                        $query[$key]['itemCaseQty'] = 0;
                        $query[$key]['itemPieceQty'] = 1;
                    }
                }



                if (sizeof($query) > 0) {
                    $this->response(array('message' => 'Success : Success fetching Data', 'data' => $query, 'status' => '1', 'status_info' => 'Success'));
                } else {
                    $this->response(array('message' => 'Success :  Not data is available', 'status' => '0', 'status_info' => 'Failure'));
                }
            }
        } catch (Exception $e) {
            echo $e->getMessage();
        }
    }

//    public function response($data = NULL, $http_code = NULL, $continue = FALSE) {
//        parent::response($data, $http_code, $continue);
//    }
    public function saveCustomerOrder_post() {
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $data = $request->data;
        $customerDetails = (array) $request->customerDetails;
        $where['username'] = $customerDetails['username'];
        $where['mobile'] = $customerDetails['mobile'];
        $where['email'] = $customerDetails['email'];

        $customerArray = $this->returnArray($where, 'TBL_CUSTOMERS');

        $data = (array) $data;
        $CartInsert = false;
        if (isset($data)) {
            $orderNumber = $this->randomSign_get(10);
            for ($i = 0; $i < sizeof($data); $i++) {
                $indCart = ((array) $data[$i]);
                $cartArray['productId'] = $indCart['id'];
                $cartArray['qty'] = $indCart['qty'];
                $cartArray['productName'] = $indCart['productName'];
                $cartArray['total'] = $indCart['total'];
                $cartArray['price'] = $indCart['price'];
                $cartArray['type'] = $indCart['type'];

                $cartArray['status'] = 1;
                $cartArray['createdBy'] = 0;
                $cartArray['customerId'] = $customerArray['id'];
                $cartArray['orderNumber'] = $orderNumber;

                if (isset($cartArray)) {
                    $CartInsert = $this->Trackers_model->insert_data($cartArray, 'TBL_ORDERS');
                    if ($CartInsert) {
                        $info = $this->createCRMTicket_get($cartArray);
                    }
                }
            }
            if ($CartInsert) {

                echo json_encode(array('message' => 'Order has been Saved,you order number is ' . $cartArray['orderNumber'], 'data' => $cartArray,
                    'status' => '1', 'status_info' => 'Success'));
            } else {
                $this->response(array('message' => 'Order Could Not Be saved, Try Again', 'status' => '1', 'status_info' => 'Fail'));
            }
        }
    }

    public function createCRMTicket_get($indCart) {

        $where['id'] = $indCart['customerId'];
        $customerArray = $this->returnArray($where, 'TBL_CUSTOMERS');
        $cartArray['desc'] = 'NEW INSTALLATION,Service ' . $indCart['productName'] .
                ', Quantity : ' . $indCart['qty'] . ', ' .
                $indCart['productName'] . ',Ticket created from store';
        $cartArray['issue'] = 'NEW INSTALLATION';
        $cartArray['dateCreated'] = time();

        $cartArray['custId'] = '';
        $cartArray['vehicleId'] = '';

        $cartArray['closedFlag'] = 0;
        $cartArray['type'] = 'support';

        $cartArray['status'] = 7;
        $cartArray['createdBy'] = 9;
        $cartArray['location'] = $customerArray['location'];
        $cartArray['name'] = $customerArray['fullnames'];
        $cartArray['mobile_1'] = $customerArray['mobile'];
        $cartArray['createdBy'] = 0;

        $cartArray['extraInfo'] = $indCart['orderNumber'];






        $curl_handle = curl_init();
        curl_setopt($curl_handle, CURLOPT_URL, 'http://172.16.10.25:8089/bcmbe/index.php/api/saveOrderFromCart/');
        curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curl_handle, CURLOPT_POST, 1);
        curl_setopt($curl_handle, CURLOPT_TIMEOUT, 5);
        curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $cartArray);

        // Optional, delete this line if your API is open
        // curl_setopt($curl_handle, CURLOPT_USERPWD, $username . ':' . $password);

        $buffer = curl_exec($curl_handle);
        curl_close($curl_handle);

        $result = json_decode($buffer);

        if (isset($result->status) && $result->status == 'success') {
            return $result->status;
        } else {
            return 'Something has gone wrong';
        }
    }

    function ci_curl($new_name, $new_email) {
        $username = 'admin';
        $password = '1234';

        $this->load->library('curl');

        $this->curl->create('http://localhost/restserver/index.php/example_api/user/id/1/format/json');

        // Optional, delete this line if your API is open
        $this->curl->http_login($username, $password);

        $this->curl->post(array(
            'name' => $new_name,
            'email' => $new_email
        ));

        $result = json_decode($this->curl->execute());

        // if (isset($result->status)) {
        echo $result->status; //'User has been updated.';
        // } else {
        //echo 'Something has gone wrong';
        // }
    }

    public function saveDataGenFunction_post() {
        try {
            $postData = $this->returnJsonObject(file_get_contents("php://input"));
            $table_name = $postData['table'];
            $postdata = $postData['data'];


            $postdata = (array) $postdata;

            $postdata['status'] = 1;

            if (isset($postdata) && is_array($postdata)) {
                $column = $this->returnMainColumn_get($table_name);
                $postdata['dateCreated'] = date('m-d-Y H:i', time());
                $whereColumn[$column] = $postdata[$column];

                $queryExist2 = $this->Trackers_model->getAllData($whereColumn, $table_name);

                if (sizeof($queryExist2) == 0) {
                    $query = $this->Trackers_model->insert_data($postdata, $table_name);

                    if ($table_name == 'TBL_PAYMENTS') {

                        $wherez['orderNumber'] = $postdata['orderId'];

                        if (isset($postdata['productId']) && $postdata['productId'] > 0) {
                            $wherez['productId'] = $postdata['productId'];
                        } else {
                            
                        }

                        $updata['paidStatus'] = 1;

                        $updateData = $this->Trackers_model->update_data_where('TBL_ORDERS', $wherez, $updata);
                    }

                    if ($query) {
                        if (isset($postData['customerChecker'])) {
                            $message = $this->composeCustomerRegMessage_get($postdata['fullnames']);
                            $sendTo = $postdata['email'];

                            $this->sendMailMessage_get($sendTo, $message, 'Registration');
                        }
                        $this->response(array('message' => 'Success : Data  saved successfully', 'status' => '1', 'status_info' => 'Success'));
                    } else {
                        $this->response(array('message' => 'Error : Incorrect data submitted', 'status' => '0', 'status_info' => 'Failure'));
                    }
                } else {
                    $this->response(array('message' => 'Error : ' . $column . ' has already been used', 'status' => '0', 'status_info' => 'Failure'));
                }
            } else {
                $this->response(array('message' => 'Error : Incorrect data submitted', 'status' => '0', 'status_info' => 'Failure'));
            }
        } catch (Exception $e) {
            $this->saveErrorLogs_get($e, 'saveErrorLogs_get');
            $this->response(array('message' => 'Error : Incorrect data submitted', 'status' => '0', 'status_info' => 'Failure'));
        }
    }

    public function updateWhere_post() {
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);

        $where['id'] = $request->id;
        $data = $request->data;
        $data = (array) $data;

        $table_name = $request->tableName;
        $whereTicket['id'] = $where['id'];
        if (isset($where['id'])) {

            $updateData = $this->Trackers_model->update_data_where($table_name, $where, $data);
            $this->response(array('message' => 'Success : Data Update Successfull', 'status' => '1', 'status_info' => 'failure',
                'data' => null));
        } else {
            $this->response(array('message' => 'Error : Could not update data', 'status' => '0', 'status_info' => 'failure',
                'data' => null));
        }
    }

    public function updateImagepath_post() {
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);

        $where['code'] = $request->code;
        $update['imageUrl'] = $request->imageUrl;

        $table_name = 'TBL_PRODUCTS';
        if (isset($where['code'])) {
            $updateData = $this->Trackers_model->update_data_where($table_name, $where, $update);
            $this->response(array('message' => 'Success : Data Update Successfull', 'status' => '1', 'status_info' => 'failure', 'data' => null));
        } else {
            $this->response(array('message' => 'Error : Could not update data', 'status' => '0', 'status_info' => 'failure',
                'data' => null));
        }
    }

    public function customerLogin_post() {
        try {
            $postData = $this->returnJsonObject(file_get_contents("php://input"));
//            print_r($postData);
//            exit();

            if (isset($postData) && is_array($postData)) {
                $getUserDetails = $this->Trackers_model->getAllData($postData, 'TBL_CUSTOMERS');
                if (sizeof($getUserDetails) == 1) {
                    foreach ($getUserDetails as $key => $value) {
                        $data['fullnames'] = $value['fullnames'];
                        $data['username'] = $value['username'];
                        $data['email'] = $value['email'];
                        $data['mobile'] = $value['mobile'];
                        $data['location'] = $value['location'];
                        $data['address'] = $value['address'];
                        $data['country'] = $value['country'];
                        $data['county'] = $value['county'];
                        $data['id'] = $value['id'];
                    }


                    $this->response(array('message' => 'Success : Log in Was successful', 'status' => '1', 'status_info' => 'Success', 'data' => $data));
                } else {
                    $this->response(array('message' => ' Wrong Username or Password', 'status' => '0', 'status_info' => 'Failure'));
                }
            } else {
                $this->response(array('message' => 'Error : Incorrect data submitted', 'status' => '0', 'status_info' => 'Failure'));
            }
        } catch (Exception $e) {
            $this->saveErrorLogs_get($e, 'saveErrorLogs_get');
            $this->response(array('message' => 'Error : Incorrect data submitted', 'status' => '0', 'status_info' => 'Failure'));
        }
    }

    public function searchService_post() {
        $postData = $this->returnJsonObject(file_get_contents("php://input"));
        $search = $postData['searchData'];
        if (isset($search)) {

            $query = $this->Trackers_model->searchService($search, $postData['columns']);
            foreach ($query as $key => $value) {

                $query[$key]['itemCaseQty'] = 0;
                $query[$key]['itemPieceQty'] = 1;
            }
            if (sizeof($query) > 0) {
                $this->response(array('message' => 'Success : Success fetching Data', 'data' => $query, 'status' => '1', 'status_info' => 'Success'));
            } else {
                $this->response(array('message' => 'Not data is available', 'status' => '0', 'status_info' => 'Failure'));
            }
        }
    }

    public function searchItem_post() {
        $postData = $this->returnJsonObject(file_get_contents("php://input"));
        $search = $postData['searchData'];
        if (isset($search)) {

            $query = $this->Trackers_model->searchItem($search, $postData['columns']);
            foreach ($query as $key => $value) {

                $query[$key]['itemCaseQty'] = 0;
                $query[$key]['itemPieceQty'] = 1;
            }
            if (sizeof($query) > 0) {
                $this->response(array('message' => 'Success : Success fetching Data', 'data' => $query, 'status' => '1', 'status_info' => 'Success'));
            } else {
                $this->response(array('message' => 'Not data is available', 'status' => '0', 'status_info' => 'Failure'));
            }
        }
    }

    public function userLogin_post() {
        try {
            $postData = $this->returnJsonObject(file_get_contents("php://input"));
//            print_r($postData);
//            exit();

            if (isset($postData) && is_array($postData)) {
                $getUserDetails = $this->Trackers_model->getAllData($postData, 'TBL_BACKEND_USERS');
                if (sizeof($getUserDetails) == 1) {
                    foreach ($getUserDetails as $key => $value) {
                        $data = $value;
                    }


                    $this->response(array('message' => 'Success : Log in Was successful', 'status' => '1', 'status_info' => 'Success', 'data' => $data));
                } else {
                    $this->response(array('message' => 'Error : Wrong Username or Password', 'status' => '0', 'status_info' => 'Failure'));
                }
            } else {
                $this->response(array('message' => 'Error : Incorrect data submitted', 'status' => '0', 'status_info' => 'Failure'));
            }
        } catch (Exception $e) {
            $this->saveErrorLogs_get($e, 'saveErrorLogs_get');
            $this->response(array('message' => 'Error : Incorrect data submitted', 'status' => '0', 'status_info' => 'Failure'));
        }
    }

    public function getAllInvoices_get($where, $type) {

        $where['status'] = 1;

        $tableName = 'TBL_ORDERS';
        if ($type == 1) {
            $where['paidStatus'] = 1;
        }

        $getData = $this->Trackers_model->getAllData($where, $tableName);

        if (sizeof($getData) > 0) {
            $sum = 0;
            $vat = 0;
            foreach ($getData as $key => $value) {
                $data[$key]['id'] = $value['id'];
                $whereC['id'] = $value['customerId'];
                $data[$key]['type'] = $value['type'];
                $wheres['id'] = $value['productId'];
                $servDetails = $this->returnArray($wheres, 'tbl_products');
                if ($data[$key]['type'] == 'service') {
                    $servDetails = $this->returnArray($wheres, 'tbl_services');
                }

                $data[$key]['name'] = $servDetails['name'];
                $data[$key]['desc'] = $servDetails['desc'];
                $data[$key]['vat'] = $servDetails['vat'];
                $data[$key]['qnty'] = $servDetails['qnty'];
                $data[$key]['Specs'] = $servDetails['Specs'];

                $data[$key]['dateCreated'] = $value['dateCreated'];

                $data[$key]['productName'] = $value['productName'];
                $data[$key]['price'] = $value['price'];
                $data[$key]['total'] = $value['total'];
                $data[$key]['qty'] = $value['qty'];
                $sum +=$data[$key]['total'];
                $vat +=round(($data[$key]['total'] * $data[$key]['vat']) / 100, 2);
            }
            $dataFinal['data'] = $data;
            $dataFinal['sum'] = $sum;
            $dataFinal['vat'] = $vat;
            $dataFinal['amount'] = $sum - $vat;
            return $dataFinal;
//$this->response(array('message' => 'success data fetching', 'status' => '1', 'data' => $data, 'status_info' => 'success'));
        } else {
            $this->response(array('message' => 'no data history could not be found', 'status' => '0', 'status_info' => 'failure',
                'data' => null));
        }
    }

    public function composeCustomerRegMessage_get($fullnames) {
        $html = '';
        $html.='Dear ' . $fullnames . '<br>';
        $html.='<h2>Thank You!</h3>';
        $html.='<h3>You Registration was successfully,Please click on the link below to continue shopping</3>';

        $html.='<br>Regards,<br>Flex Communications Limited.';
        return $html;
    }

    public function sendMailMessage_get($sendTo, $message, $subject) {

        $config['useragent'] = 'CodeIgniter';
        $config['protocol'] = 'smtp';
        $config['smtp_host'] = 'ssl://mail.flexcom.co.ke';
        $config['smtp_user'] = 'certificate@flexcom.co.ke'; // Your  id
        $config['smtp_pass'] = 'cert2016'; // Your  Password
        $config['smtp_port'] = 465;
        $config['wordwrap'] = TRUE;
        $config['wrapchars'] = 76;
        $config['mailtype'] = 'html';
        $config['charset'] = 'iso-8859-1';
        $config['validate'] = FALSE;
        $config['priority'] = 3;
        $config['newline'] = "\r\n";
        $config['crlf'] = "\r\n";

        $this->load->library('email');
        $this->email->initialize($config);
        $this->email->subject($subject);

        $this->email->from('certificate@flexcom.co.ke', 'Flex Communications');
        $array = array();

        $this->email->to($sendTo);

        $this->email->message($message);



        if ($this->email->send()) {
            return true;
        } else {
            return show_error($this->email->print_debugger());
        }
    }

    public function sendMail_get($sendTo, $message, $emailPath, $subject) {

             $config['useragent'] = 'CodeIgniter';
        $config['protocol'] = 'smtp';
        $config['smtp_host'] = 'ssl://mail.flexcom.co.ke';
        $config['smtp_user'] = 'certificate@flexcom.co.ke'; // Your  id
        $config['smtp_pass'] = 'cert2016'; // Your  Password
        $config['smtp_port'] = 465;
        
        $config['wordwrap'] = TRUE;
        $config['wrapchars'] = 76;
        $config['mailtype'] = 'html';
        $config['charset'] = 'iso-8859-1';
        $config['validate'] = FALSE;
        $config['priority'] = 3;
        $config['newline'] = "\r\n";
        $config['crlf'] = "\r\n";

        $this->load->library('email');
        $this->email->initialize($config);
        $this->email->subject($subject);

        $this->email->from('certificate@flexcom.co.ke', 'Flex Communications');
        $array = array();

        $this->email->to($sendTo);

        $this->email->message($message);

        $this->email->attach($emailPath);

        if ($this->email->send()) {
            return true;
        } else {
            return show_error($this->email->print_debugger());
        }
    }

    public function createHTMLInvoice_get($where, $type) {
        date_default_timezone_set('Africa/Nairobi');
        $where['status'] = 1;

        if ($type == 1) {
            $docType = 'Invoice';
        } else {
            $docType = 'Quotation';
        }


        $customerId = $this->returnArray($where, 'tbl_orders');
        $whereCustomer['id'] = $customerId['customerId'];
        $customerDetails = $this->returnArray($whereCustomer, 'tbl_customers');

        $getDatas = $this->getAllInvoices_get($where, $type);

        $getData = $getDatas['data'];
        $html = '';
        $html .= '<style>' . file_get_contents(__DIR__ . '/css/main-wrapper.css') . '</style>';
        $html.='<table   width="100%">'
                . '<tr width="100%">'
                . '<td width="85%" >'
                . '</td>'
                . '<td width="15%"> <b>' . $docType . '</b><br>'
                . '</td>'
                . '</tr>'
                . '</table>';
        $whereSettings['id'] = 1;

        $settings = $this->returnArray($whereSettings, 'TBL_SETTINGS');
        $html.='<table cellspacing="0"  width="100%">'
                . '<tr > 
                    <th rowspan="4"></th>
                    <th width="45%"></th>
                    <td width="15%" style="border:1px black solid;">Date</td>
                    <td width="15%" style="border:1px black solid;">' . substr($customerId['dateCreated'], 0, 10) . '</td>
                   </tr>
                   <tr>
                    <th></th>
                    <td width="15%" style="border:1px black solid;">' . $docType . ' No.</td>
                    <td width="15%" style="border:1px black solid;">' . $where['orderNumber'] . '</td>
                   </tr>'
                . '</table>';
        $html.='<br><br>';
        $html.='';
        if (sizeof($getData) > 0) {

            /*    . '<tr width="100%">'
              . '<td width="68%" >'
              . '</td>'
              . '<td width="15%" style="border:1px black solid;"> Date : '
              . '</td>'
              . '<td width="17%" style="border:1px black solid;"> ' . date('m/d/Y', $getData['dateCreated'])
              . '</td>'
              . '</tr>'
              . '<tr width="100%">'
              . '<td width="68%">'
              . '</td>'
              . '<td width="15%" style="border:1px black solid;"> Invoice No : '
              . '</td>'
              . '<td width="17%" style="border:1px black solid;"> ' . $getData['invoiceNo']
              . '</td>'
              . '</tr>'
              . '</table>';
             */
            $html.='<table class=pdfTable  width="100%">'
                    . '<tr width="100%">'
                    . '<td width="60%" >'
                    . '<b>FLEX COMMINCATIONS LIMITED,</b><br>'
                    . '<b>P.O BOX 8025, 00200 KIPRO CENTRE,</b><br>'
                    . '<b>Sports Road, Westlands, Nairobi,</b><br>'
                    . '<b>Office: 0712 664-190 | 0703 302-958,</b><br>'
                    . '<b>Email: info@flexcom.co.ke</b>'
                    . '</td>'
                    . '<td width="40%" style="border:1px solid black;">'
                    . '<b> &nbsp;&nbsp; ' . $docType . ' to : </b><hr>'
                    . '<b> &nbsp;&nbsp;' . $customerDetails['fullnames'] . '</b><br>'
                    . '<b> &nbsp;&nbsp;' . $customerDetails['mobile'] . '</b><br>'
                    . '<b> &nbsp;&nbsp;' . $customerDetails['address'] . '</b><br>'
                    . '<b> &nbsp;&nbsp;' . $customerDetails['location'] . '</b><br>'
                    . '<b> &nbsp;&nbsp;' . $customerDetails['email'] . '</b><br></td>'
                    . '</tr>'
                    . '</table>';
            $html.='<br><br>';
            $html.='<br><br>';
            $html.='<table width="100%" cellspacing="0" style="border:1px black solid;">';

            $html.='<tr style="border:1px black red; background-color:grey;">';

            $html.='<td width="3%" style="border-bottom:1px black solid;border-left:0px black solid;">#</td>';
            $html.='<td nowrap width="24%" style="border-bottom:1px black solid;border-left:0px black solid;">Product</td>';
            $html.='<td nowrap width="24%" style="border-bottom:1px black solid;border-left:0px black solid;">Description</td>';
            $html.='<td width="12%" style="border-bottom:1px black solid;border-left:0px black solid;">Type</td>';
            $html.='<td width="6%" style="border-bottom:1px black solid;border-left:0px black solid;">Qnty</td>';
            $html.='<td  style="border-bottom:1px black solid;border-left:0px black solid;">Amount</td>';
            $html.='<td width="6%" style="border-bottom:1px black solid;border-left:0px black solid;">VAT</td>';
            $html.='<td  style="border-bottom:1px black solid;border-left:0px black solid;">Total</td>'
                    . '</tr>';

            foreach ($getData as $key => $value) {


                $html.='<tr style="border:1px black solid;">';

                $html.='<td style="border-bottom:1px black solid;border-left:0px black solid;">' . ($key + 1) . '</td>';
                $html.='<td nowrap  style="border-bottom:1px black solid;border-left:0px black solid;">' . $value['name'] . '</td>';
                $html.='<td nowrap  style="border-bottom:1px black solid;border-left:0px black solid;">' . $value['desc'] . '</td>';
                $html.='<td style="border-bottom:1px black solid;border-left:0px black solid;">' . $value['type'] . '</td>';
                $html.='<td style="border-bottom:1px black solid;border-left:0px black solid;">' . $value['qty'] . '</td>';
                $html.='<td style="border-bottom:1px black solid;border-left:0px black solid;">' . number_format($value['price']) . '</td>';
                $html.='<td style="border-bottom:1px black solid;border-left:0px black solid;">' . $value['vat'] . '</td>';
                $html.='<td style="border-bottom:1px black solid;border-left:0px black solid;">' . number_format($value['total']) . '</td>';

                $html.='</tr>';
            }
            $html.= '</table>';
            $html.='<br>';

            $html.='<p height="1000" >';
            $html.='<table style="border:1px black solid;bottom:0px;"    width="100%">'
                    . '<tr width="100%">'
                    . '<td width="17.5%" style="border:1px black solid;"> PIN : '
                    . '</td>'
                    . '<td width="17.5%" style="border:1px black solid;"> ' . $settings['pinNo']
                    . '</td>'
                    . '<td width="17.5%" style="border:1px black solid;"> VAT No : '
                    . '</td>'
                    . '<td width="17.5%" style="border:1px black solid;"> ' . $settings['vatNo']
                    . '</td>'
                    . '<td width="30%" style="border:1px black solid;">'
                    . 'SubTotal : KES ' . number_format($getDatas['amount'], 2) . ' <hr>'
                    . 'VAT : KES ' . number_format($getDatas['vat'], 2) . ' <hr>'
                    . 'Total : KES ' . number_format($getDatas['sum'], 2) . ''
                    . '</td>'
                    . '</tr>'
                    . '</table>';


            $html.='</p>';

            $html.='<table style="border:1px black solid;"  width="100%" height="30%">'
                    . '<tr align="center">'
                    . '<td><b>Make all Cheques payable to FLEX COMMUNICATIONS LTD <BR>THANK YOU FOR YOUR BUSINESS</b></td>'
                    . '</tr>'
                    . '</table>';
        } else {
            $html .= 'NO INVOICE<hr></div>';
        }

        return $html;
    }

    public function generateInvoice_post() {
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $where['orderNumber'] = $request->orderNumber;
        $type = $request->type;
        if ($type == 1) {
            $docType = 'Invoice';
        } else {
            $docType = 'Quotation';
        }
        if (isset($where)) {
// $getUserDetails = $this->Trackers_model->getAllData($postData, 'TBL_ORDERS');

            $info['printedBy'] = 9; //$request->printedBy;

            $this->load->library('Pdf');
            $title = 'INVOICE';
            $pdf = new Pdf('L', 'mm', 'A4', true, 'UTF-8', TRUE);
            // ob_start();
            // $pdf->SetFont('times', 11);
            $pdf->SetFont('helvetica', 11);
            $pdf->AddPage('P', 'A4');

            $pdf->SetTitle("INVOICE");
            $pdf->SetHeaderMargin(10);
            $pdf->SetTopMargin(10);
            $pdf->setFooterMargin(0);
            $pdf->SetAutoPageBreak(true);
            $pdf->SetAuthor('Author');
            $pdf->SetDisplayMode('real', 'default');
            $pdf->setPageMark();
            $pdf->SetMargins(4, PDF_MARGIN_TOP, 4);
            $pdf->setPrintFooter(false);
            if ($type == 1) {
                $pdf->StartTransform();
                $pdf->SetFont('dejavusans', '', 11, '', true);

                $pdf->Rotate(45);

                $pdf->Cell(0, 10, 'PAID', 1, 1, 'L', 0, '');

                $pdf->StopTransform();
            }
            $html = $this->createHTMLInvoice_get($where, $type);

            $pdf->writeHTML($html, true, false, true, false, '');

            ob_end_clean();

            $timeData = date('Y-m-d', time()) . " Invoice ";
            $emailPath = $_SERVER["DOCUMENT_ROOT"] . 'orders/' . $where['orderNumber'] . '-' . $docType . '.pdf';
            try {
                $Cdetails = $this->returnMessage($where['orderNumber']);

                $pdf->Output($emailPath, 'FD');
                $default_path = 'http://' . $_SERVER['SERVER_NAME'] . '/orders/' . $where['orderNumber'] . '-' . $docType . '.pdf';
                $this->sendMail_get($Cdetails['email'], $Cdetails['message'], $emailPath, $Cdetails['subject']);

                echo json_encode(array('message' => 'invoice generated successfully', 'status' => '1', 'data' => $default_path, 'status_info' => 'Success'));
            } catch (Exception $e) {
                
            }
        }
    }

    public function generateInvoiceEmail_post() {
        $postdata = file_get_contents("php://input");
        $request = json_decode($postdata);
        $where['orderNumber'] = $request->orderNumber;
        $email = $request->email;
        if (isset($where)) {
            // $getUserDetails = $this->Trackers_model->getAllData($postData, 'TBL_ORDERS');

            $info['printedBy'] = 9; //$request->printedBy;

            $this->load->library('Pdf');
            $title = 'INVOICE';
            $pdf = new Pdf('L', 'mm', 'A4', true, 'UTF-8', TRUE);
            // ob_start();
            // $pdf->SetFont('times', 11);
            $pdf->SetFont('helvetica', 11);
            $pdf->AddPage('P', 'A4');

            $pdf->SetTitle("iNVOICE");
            $pdf->SetHeaderMargin(10);
            $pdf->SetTopMargin(10);
            $pdf->setFooterMargin(0);
            $pdf->SetAutoPageBreak(true);
            $pdf->SetAuthor('Author');
            $pdf->SetDisplayMode('real', 'default');
            $pdf->setPageMark();
            $pdf->SetMargins(4, PDF_MARGIN_TOP, 4);
            $pdf->setPrintFooter(false);

            $html = $this->createHTMLInvoice_get($where);

            $pdf->writeHTML($html, true, false, true, false, '');

            ob_end_clean();

            $timeData = date('Y-m-d', time()) . " Invoice ";
            $emailPath = $_SERVER["DOCUMENT_ROOT"] . 'orders/' . $where['orderNumber'] . '.pdf';
            try {
                $Cdetails = $this->returnMessage($where['orderNumber']);

                $pdf->Output($emailPath, 'FD');
                $default_path = 'http://' . $_SERVER['SERVER_NAME'] . '/orders/' . $where['orderNumber'] . '.pdf';
                $this->sendMail_get($email, $Cdetails['message'], $emailPath, $Cdetails['subject']);

                echo json_encode(array('message' => 'invoice generated successfully', 'status' => '1', 'data' => $default_path, 'status_info' => 'Success'));
            } catch (Exception $e) {
                
            }
        }
    }

    public function returnMessage($orderNumber) {

        $where['orderNumber'] = $orderNumber;
        $Cdetails = $this->returnArray($where, 'TBL_ORDERS');
        if (sizeof($Cdetails) > 0) {
            $WhereS['id'] = $Cdetails['customerId'];
            $Cdetails = $this->returnArray($WhereS, 'TBL_CUSTOMERS');
            $message = 'Dear ' . $Cdetails['fullnames'] . '<br>';
            $message.='Please find attached Quotation (' . $where['orderNumber'] . ')<br>';
            $message.='Regards.<br>Do NOT REPLY';
        }
        $Cdetails['message'] = $message;
        $Cdetails['subject'] = 'Flex Communication Order ' . $where['orderNumber'];
        return $Cdetails;
    }

}

?>