<?php
class Model_main extends CI_Model{
	public function Model_main(){
		parent::__construct();
	}
	
	public function login($data){
		$this->db->where('email',$data['email']);
		$this->db->where('status','1');
		$this->db->where('passd',md5($data['passd']));
		$qry = $this->db->get('users');
		return $qry;
	}
	
	public function get_all_where($tbl,$whr){
		$this->db->order_by('id','desc');
		$qry = $this->db->get_where($tbl,$whr);
		return $qry;
		
	}
	
	public function get_all($tbl){
		$this->db->order_by('id','desc');
		$q = $this->db->get($tbl);
		return $q;
	
	}
	
	public function insert_data($in,$tbl){
	
		$this->db->insert($tbl,$in);
		
	}
	
	public function update_data($tbl,$id,$up){
		$this->db->where('id',$id);
		
		$this->db->update($tbl,$up);
	}
	
	public function alt_update_data($tbl,$id_array,$up){
		
		$this->db->where($id_array);
		
		$this->db->update($tbl,$up);
	
	}
	
	public function get_row_where($tbl,$whr){
		$this->db->order_by('id','desc');
		$this->db->limit('1');
		$this->db->where($whr);
		$q = $this->db->get($tbl);
		return $q;
	}
	
	public function get_all_like($tbl,$lik){
		$this->db->where('status',1);
		$this->db->like($lik);
		$q = $this->db->get($tbl);
		return $q;
	}
	
	public function get_all_like_all($tbl,$lik){
		
		$this->db->like($lik);
		$q = $this->db->get($tbl);
		return $q;
	}
	
	public function sum_data($tbl,$whr,$col){
	
		$this->db->where($whr);
		$this->db->select_sum($col);
		$q = $this->db->get($tbl);
		return $q;
	}
	
	public function delete_data($tbl,$whr){
		$this->db->where($whr);
		$q = $this->db->delete($tbl);
		
	}
	
	public function srch_users($srch){

		
		$this->db->like('fname', $srch);
		$this->db->or_like('lname', $srch);
		$this->db->or_like('email', $srch);
		$this->db->or_like('acc_no', $srch);
		$this->db->or_like('phone', $srch);
		$this->db->or_like('id_no', $srch);
		
		$q = $this->db->get('users');
		return $q;
	
	}

	
	public function select_all_where($table="", $fields="", $whr){
	
		
	 		$this->db->select ( $fields );		
	 		$this->db->where ( $whr);
	 		$query = $this->db->get ( $table );
	 		return $query;
	 		
	}

	public function check_user_cred($data){

		$this->db->select('id');

		$this->db->where('id_no', $data['id_no']);
		$this->db->or_where('email', $data['email']); 
		$this->db->or_where('phone', $data['phone']); 

		return $this->db->get("users");
	}
	
	public function select_all_like($tbl="", $fields="", $lik){
		$this->db->select($fields);
		$this->db->like($lik);
		$q = $this->db->get($tbl);
		return $q;
		
	}

	public function inspector_search($plate_no){

		$this->db->where('status',1);
              $this->db->where('car_no',$plate_no);
		$this->db->select('id');
              $this->db->select('pay_date');
              $q = $this->db->get('gen_service');
		return $q;

	}

	public function get_inspector_total($data){
		error_reporting(0);
		$this->db->where('check_time >=', $data['start_day']);
		$this->db->where('check_time <=', $data['now']);
		$this->db->where('user_id',$data['user_id']);
		$this->db->select('id');
		$q = $this->db->get('checks');
		return $q->num_rows();
	}


	public function pos_menu($acc_no){

		$q = $this->db->query("SELECT DISTINCT service_head FROM service_sub WHERE acc_no='$acc_no'");
		
		return $q;
	}

	
	public function sec_pos_menu($data){

		$this->db->like('service_head',$data['service_head']);
		$this->db->where('acc_no',$data['acc_no']);

		$q = $this->db->get('service_sub');

		return $q;

	}


	public function date_range_payments_filter($data){

		$to = $data['to'];
			
		$from = $data['from'];		

		$q = $this->db->query("SELECT * FROM total_payments WHERE DATE BETWEEN '$from' AND '$to'");

		return $q;

	}

	public function check_car_fines($data){

		$this->db->where('car_no',$data['car_no']);

		$this->db->select_sum('total_fine');

		$q = $this->db->get('total_fines');
		
		return $q;
	}


}
?>