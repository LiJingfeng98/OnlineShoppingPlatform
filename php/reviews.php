<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $type = $_GET['type'];
  $uid = $_GET['uid'];
  if($type==1){
    $page = 1;
    $page = $_GET['page'];
    $num = ($page-1)*8;
    // sql
    $sql = "select a.goodid,goodname,a.type,time,comment from goodcomment a inner join goodinfo b where a.goodid = b.goodid and userid = ".$uid." order by time desc limit ".$num.",8";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$gid);
    $result -> bindColumn(2,$gname);
    $result -> bindColumn(3,$type);
    $result -> bindColumn(4,$time);
    $result -> bindColumn(5,$comment);
    $info = [];
    for($i=0;$result->fetch(PDO::FETCH_COLUMN);$i++){
      $info[$i] = array('gid'=>$gid,'gname'=>$gname,'type'=>$type,'time'=>$time,'comment'=>$comment);
    }
    //将索引到的数据放入$success中并进行返回
    $success['commentListInfo'] = $info;

    //获取用户名字
    $sql = 'select userName from userinfo where userid = '.$uid;
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$uname);
    $result->fetch(PDO::FETCH_COLUMN);
    $success['username'] = $uname;

    // 获取总页数
    $sql = 'select count(*) from goodcomment where userid = '.$uid;
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$sum);
    $result->fetch(PDO::FETCH_COLUMN);
    $sum /= 8;
    $success['maxPage'] = ceil($sum);
  }
  else if($type==2){
    $gid=$_GET['gid'];
    $sql = "delete from goodcomment where goodid=".$gid." and userid =".$uid;
    $halfPro = $pdo -> prepare($sql);
    $result = $halfPro -> execute();
  }

  echo json_encode($success);

 ?>
