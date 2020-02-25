<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $loginName =$_POST['loginName'];
  $passWord =$_POST['passWord'];

  $sql = "select * from userinfo where userloginname = ? and userpassword = ?";
  $halfPro = $pdo -> prepare($sql);
  $result = $halfPro -> execute([$loginName,$passWord]);
  $halfPro -> bindColumn(1,$userid);
  $halfPro -> bindColumn(3,$username);
  $halfPro -> bindColumn(5,$grantp);
  $halfPro -> bindColumn(6,$balance);
  $halfPro -> bindColumn(7,$userimg);
  $halfPro -> bindColumn(8,$custom);
  // flag 0查询失败，1查询成功
  $flag = 0;
  if($halfPro->fetch(PDO::FETCH_COLUMN)){
    setcookie('userid',$userid,time()+3600*24,'/onlineshoppingplatform');
    setcookie('username',$username,time()+3600*24,'/onlineshoppingplatform');
    setcookie('grantp',$grantp,time()+3600*24,'/onlineshoppingplatform');
    setcookie('balance',$balance,time()+3600*24,'/onlineshoppingplatform');
    setcookie('userimg',$userimg,time()+3600*24,'/onlineshoppingplatform');
    setcookie('custom',$custom,time()+3600*24,'/onlineshoppingplatform');
    $flag = 1;
  }
  $success['infoCode'] = $flag;
  echo json_encode($success);



?>
