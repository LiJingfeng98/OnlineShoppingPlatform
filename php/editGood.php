<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $type = $_GET['type'];
  $gid = $_GET['gid'];
  if($type == 1){
    // 个人信息获取
    $sql = "select goodname,owner,rdate,price,detail from goodinfo where goodid  = ?";
    $halfPro = $pdo -> prepare($sql);
    $result = $halfPro -> execute([$gid]);
    $halfPro -> bindColumn(1,$gname);
    $halfPro -> bindColumn(2,$owner);
    $halfPro -> bindColumn(3,$rdate);
    $halfPro -> bindColumn(4,$price);
    $halfPro -> bindColumn(5,$detail);
    if($halfPro->fetch(PDO::FETCH_COLUMN)){
      $info = array('gname'=>$gname,'owner'=>$owner,'rdate'=>$rdate,'price'=>$price,'detail'=>$detail);
      $success['goodInfo'] = $info;
      $success['infoCode'] = 1;
    }
    // 未查询到结果
    else {
      $success['infoCode'] = 0;
    }
  }
  else if($type == 2){
    // 更新用户数据
    $owner =$_GET['owner'];
    $rdate =$_GET['rdate'];
    $price =$_GET['price'];
    $detail =$_GET['detail'];
    // infoCode 1更新成功，0失败
    $sql = "update goodinfo set owner = ?,rdate= ?,price= ?,detail= ? where goodid = ?";
    $halfPro = $pdo -> prepare($sql);
    $halfPro -> bindValue(1,$owner);
    $halfPro -> bindValue(2,$rdate);
    $halfPro -> bindValue(3,$price);
    $halfPro -> bindValue(4,$detail);
    $halfPro -> bindValue(5,$gid);
    if($result = $halfPro -> execute()){
      $success['infoCode'] = 1;
    }
    else{
      $success['infoCode'] = 0;
    }
}
  echo json_encode($success);



?>
