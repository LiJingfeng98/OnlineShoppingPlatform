<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
    // 新增商品数据
    $gname =$_GET['gname'];
    $owner =$_GET['owner'];
    $rdate =$_GET['rdate'];
    $price =$_GET['price'];
    $discount =$_GET['discount'];
    $gtype =$_GET['gtype'];
    $detail =$_GET['detail'];
    $gimg = $_GET['gimg'];
    // infoCode 1更新成功，0失败
    $sql = "insert into goodinfo(owner,rdate,price,detail,goodname,goodimg,discount,type) values  (?,?,?,?,?,?,?,?)";
    $halfPro = $pdo -> prepare($sql);
    $halfPro -> bindValue(1,$owner);
    $halfPro -> bindValue(2,$rdate);
    $halfPro -> bindValue(3,$price);
    $halfPro -> bindValue(4,$detail);
    $halfPro -> bindValue(5,$gname);
    $halfPro -> bindValue(6,$gimg);
    $halfPro -> bindValue(7,$discount);
    $halfPro -> bindValue(8,$gtype);
    if($result = $halfPro -> execute()){
      $success['infoCode'] = 1;
    }
    else{
      $success['infoCode'] = 0;
    }
  echo json_encode($success);



?>
