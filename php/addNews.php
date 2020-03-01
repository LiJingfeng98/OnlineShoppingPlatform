<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
    // 新增商品数据
    $title =$_GET['title'];
    $time =$_GET['time'];
    $detail =$_GET['detail'];
    // infoCode 1更新成功，0失败
    $sql = "insert into news(title,time,detail) values   (?,?,?)";
    $halfPro = $pdo -> prepare($sql);
    $halfPro -> bindValue(1,$title);
    $halfPro -> bindValue(2,$time);
    $halfPro -> bindValue(3,$detail);
    if($result = $halfPro -> execute()){
      $success['infoCode'] = 1;
    }
    else{
      $success['infoCode'] = 0;
    }
  echo json_encode($success);



?>
