<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $type = $_GET['type'];
  $uid = $_GET['uid'];
  // type1获取内容 2删除内容
  if($type==1){
    // 获取购物车列表
    $sql = "select a.goodid,goodname,price from shoppingcart a inner join goodinfo b where a.goodid = b.goodid and userid = ".$uid;
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$gid);
    $result -> bindColumn(2,$gname);
    $result -> bindColumn(3,$price);
    $info = [];
    for($i=0;$result->fetch(PDO::FETCH_COLUMN);$i++){
      $info[$i] = array('gid'=>$gid,'gname'=>$gname,'price'=>$price);
    }
    //将索引到的数据放入$success中并进行返回
    $success['cartListInfo'] = $info;

    // 获取总价格
    $sql = "select sum(price) from (select price from shoppingcart a inner join goodinfo b where a.goodid = b.goodid and userid = ".$uid.") a";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$sum);
    $result->fetch(PDO::FETCH_COLUMN);
    $success['totalPrice'] = $sum;
  }else if($type==2){
    // 删除单项商品
    $gid = $_GET['gid'];
    $sql = "delete from shoppingcart where userid = ".$uid." and goodid = ".$gid;
    $result = $pdo -> prepare($sql);
    $result -> execute();
  }else if($type==3){
    // 加入库存
    $date = date('Y-m-d');
    // 获取新余额
    $sql = "select (select balance from userinfo where userid = ".$uid.")-(select sum(price) from (select price from shoppingcart a inner join goodinfo b where a.goodid = b.goodid and userid = ".$uid.") a) as newBalance";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$balance);
    $result->fetch(PDO::FETCH_COLUMN);
    // infoCode,1成功，0余额不足
    if($balance>=0){
      $sql = "insert into possessions(userid,goodid,time) select *,'".$date."'as date from shoppingcart where userid = ".$uid;
      $result = $pdo -> prepare($sql);
      $result -> execute();
      // 更新账户余额
      $sql = "update userinfo set balance = ".$balance." where userid = ".$uid;
      $result = $pdo -> prepare($sql);
      $result -> execute();
      // 清空购物车
      $sql = "delete from shoppingcart where userid = ".$uid;
      $result = $pdo -> prepare($sql);
      $result -> execute();
      // 更新cookie
      setcookie('balance',$balance,time()+3600*24,'/onlineshoppingplatform');
      $success['infoCode'] = 1;
    }else{
      $success['infoCode'] = 0;
    }
  }

  echo json_encode($success);

 ?>
