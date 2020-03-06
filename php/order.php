<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $type = $_GET['type'];
  // type 1。查询order内容 2.退货
  if($type == 1){
      $page = $_GET['page'];
      $uid = $_GET['uid'];
      $num = ($page-1)*8;
      // 查询uid的orderlist
      $sql = "select orderid,time,amount from  orderlist where userid = ".$uid." order by time desc limit ".$num.",8";
      $result = $pdo -> prepare($sql);
      $result -> execute();
      $result -> bindColumn(1,$oid);
      $result -> bindColumn(2,$time);
      $result -> bindColumn(3,$amount);
      $info = [];
      for($i=0;$result->fetch(PDO::FETCH_COLUMN);$i++){
        // 查询orderID对应详情
        $sql = "select a.goodid,a.price,a.type,goodname,goodimg from (select * from orderdetails where orderid = ".$oid.") a  inner join goodinfo b where a.goodid = b.goodid";
        $result2 = $pdo -> prepare($sql);
        $result2 -> execute();
        $result2 -> bindColumn(1,$gid);
        $result2 -> bindColumn(2,$price);
        $result2 -> bindColumn(3,$type);
        $result2 -> bindColumn(4,$gname);
        $result2 -> bindColumn(5,$gimg);
        for($j=0;$result2->fetch(PDO::FETCH_COLUMN);$j++){
          $infoDe[$j] = array('gid'=>$gid,'price'=>$price,'type'=>$type,'gname'=>$gname,'gimg'=>$gimg);
        }
        $info[$i] = array('oid'=>$oid,'time'=>$time,'amount'=>$amount,'orderDetail'=>$infoDe);
      }
      //将索引到的数据放入$success中并进行返回
      $success['orderListInfo'] = $info;

      // 获取总页数
      $sql = 'select count(*) from orderlist where userid =  '.$uid;
      $result = $pdo -> prepare($sql);
      $result -> execute();
      $result -> bindColumn(1,$sum);
      $result->fetch(PDO::FETCH_COLUMN);
      $sum /= 8;
      $success['maxPage'] = ceil($sum);
  }
  else if($type==2){
    $gid = $_GET['gid'];
    $uid = $_GET['uid'];
    // 获取购买时间
    $sql = "select time from orderlist a inner join orderdetails b on a.orderid = b.orderid where userid = ".$uid." and goodid = ".$gid;
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$date_1);
    $result->fetch(PDO::FETCH_COLUMN);
    $date_2 = date('Y-m-d');
    $Date_List_a1=explode("-",$date_1);
    $Date_List_a2=explode("-",$date_2);
    $d1=mktime(0,0,0,$Date_List_a1[1],$Date_List_a1[2],$Date_List_a1[0]);
    $d2=mktime(0,0,0,$Date_List_a2[1],$Date_List_a2[2],$Date_List_a2[0]);
    $Days=round(($d2-$d1)/3600/24);
    // 判断是否过期
    // infoCode: 1成功退款，2已过时，0未知错误
    $flag = true;
    if($Days<7){
      // 更新存款
      $sql = "update userinfo a inner join (select a.userid,balance+price as p from userinfo a inner join  orderlist b inner join orderdetails c on a.userid = b.userid and b.orderid = c.orderid where b.userid = ".$uid." and c.goodid = ".$gid.") b on a.userid = b.userid set a.balance = b.p";
      $result = $pdo -> prepare($sql);
      if(!$result -> execute()){
        $flag=false;
      }
      // 更新cookie
      $sql = "select balance from userinfo where userid = ".$uid;
      $result = $pdo -> prepare($sql);
      $result -> execute();
      $result -> bindColumn(1,$balance);
      if(!$result->fetch(PDO::FETCH_COLUMN)){
        $flag=false;
      }
      setcookie('balance',$balance,time()+3600*24,'/onlineshoppingplatform');
      // 更新已退款状态
      $sql = "update orderdetails a inner join orderlist b on a.orderid = b.orderid set type = 2 where userid = ".$uid." and goodid = ".$gid;
      $result = $pdo -> prepare($sql);
      if(!$result -> execute()){
        $flag=false;
      }
      // 更新用户库存
      $sql = "delete from possessions where userid = ".$uid." and goodid = ".$gid;
      $result = $pdo -> prepare($sql);
      if(!$result -> execute()){
        $flag=false;
      }
      if($flag){
        $success['infoCode'] = 1;
      }else{
        $success['infoCode'] = 0;
      }
    }
    else{
      // 已经过期 更新数据
      $sql = "update orderdetails a inner join orderlist b on a.orderid = b.orderid set type = 0 where userid = ".$uid." and goodid = ".$gid;
      $result = $pdo -> prepare($sql);
      if(!$result -> execute()){
        $flag=false;
      }
      if($flag){
        $success['infoCode'] = 2;
      }else{
        $success['infoCode'] = 0;
      }
    }

  }




  echo json_encode($success);

 ?>
