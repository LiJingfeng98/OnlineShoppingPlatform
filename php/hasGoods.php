<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $gid = $_GET['gid'];
  $uid = $_GET['uid'];
  $type = $_GET['type'];
  // type:1查询库存，2.查询评论，3.加入购物车
  if($type==1){
      $sql = "select count(*) from warehouse where userid = ".$uid." and goodid = ".$gid."";
  }else if($type==2){
      $sql = "select count(*) from goodcomment where userid = ".$uid." and goodid = ".$gid."";
  }else{
      $sql = "insert into shoppingcart values (".$uid.",".$gid.")";
  }

  $result = $pdo -> prepare($sql);
  $result -> execute();
  if($type==3){
    echo json_encode($success);
    return;
  }
  $result -> bindColumn(1,$flag);
  $result->fetch(PDO::FETCH_COLUMN);
  $success['flag'] = $flag;
    echo json_encode($success);
 ?>
