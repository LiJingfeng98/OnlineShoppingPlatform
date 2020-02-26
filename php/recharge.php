<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $uid =$_POST['uid'];
  $chargeNum =$_POST['chargeNum'];
// 增加金额
  $sql = "update userinfo set balance = (select * from (select balance+".$chargeNum." from userinfo where userid = ".$uid.") a ) where userid = ".$uid;
  $halfPro = $pdo -> prepare($sql);
  $result = $halfPro -> execute();
// 查询现在余额
  $sql = "select balance from userinfo where userid = ".$uid;
  $halfPro = $pdo -> prepare($sql);
  $result = $halfPro -> execute();
  $halfPro -> bindColumn(1,$balance);
  $halfPro->fetch(PDO::FETCH_COLUMN);

    setcookie('balance',$balance,time()+3600*24,'/onlineshoppingplatform');

  echo json_encode($success);



?>
