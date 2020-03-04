<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $page = 1;

  $page = $_GET['page'];
  $uid = $_GET['uid'];
  $num = ($page-1)*8;
  // sql
  $sql = "select goodid,time from possessions where userid = ".$uid." order by time desc limit ".$num.",8";
  $result = $pdo -> prepare($sql);
  $result -> execute();
  $result -> bindColumn(1,$gid);
  $result -> bindColumn(2,$time);
  $info = [];
  for($i=0;$result->fetch(PDO::FETCH_COLUMN);$i++){
    // 获取商品名字
    $sql = "select goodname from goodinfo where goodid = ".$gid;
    $result2 = $pdo -> prepare($sql);
    $result2 -> execute();
    $result2 -> bindColumn(1,$gname);
    $result2->fetch(PDO::FETCH_COLUMN);
    // 获取类别
    $sql = "select type from goodType where goodID = ".$gid." order by Num desc limit 4";
    $info2 = [];
    $result2 = $pdo -> prepare($sql);
    $result2 -> execute();
    $result2 -> bindColumn(1,$gtype);
    for($j=0;$result2->fetch(PDO::FETCH_COLUMN);$j++){
      $info2[$j]=$gtype;
    }

    $info[$i] = array('gid'=>$gid,'gname'=>$gname,'btime'=>$time,'gtype'=>$info2);
  }
  //将索引到的数据放入$success中并进行返回
  $success['goodListInfo'] = $info;

  //获取用户名字
  $sql = 'select userName from userinfo where userid = '.$uid;
  $result = $pdo -> prepare($sql);
  $result -> execute();
  $result -> bindColumn(1,$uname);
  $result->fetch(PDO::FETCH_COLUMN);
  $success['username'] = $uname;

  // 获取总页数
  $sql = 'select count(*) from possessions where userid = '.$uid;
  $result = $pdo -> prepare($sql);
  $result -> execute();
  $result -> bindColumn(1,$sum);
  $result->fetch(PDO::FETCH_COLUMN);
  $sum /= 8;
  $success['maxPage'] = ceil($sum);



  echo json_encode($success);

 ?>
