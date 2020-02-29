<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $type = $_GET['type'];//1查询 2删除
  $uid = $_GET['uid'];
  if($type==1){
    $page = $_GET['page'];
    $num = ($page-1)*8;
    // sql
    $sql = "select friendID,username,userimg from (select friendID from userfriend where userid = ".$uid.") a inner join userinfo b where a.friendID = b.userid limit ".$num.",8";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$fid);
    $result -> bindColumn(2,$fname);
    $result -> bindColumn(3,$fimg);
    $info = [];
    for($i=0;$result->fetch(PDO::FETCH_COLUMN);$i++){
      $info[$i] = array('fid'=>$fid,'fname'=>$fname,'fimg'=>$fimg);
    }
    //将索引到的数据放入$success中并进行返回
    $success['friendListInfo'] = $info;

    // 获取总页数
    $sql = 'select count(*) from userfriend where userid ='.$uid;
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$sum);
    $result->fetch(PDO::FETCH_COLUMN);
    $sum /= 8;
    $success['maxPage'] = ceil($sum);
  }
  else if($type==2){
    $fid = $_GET['fid'];
    $sql = "delete from userfriend where userid = ".$uid." and friendid = ".$fid;
    $result = $pdo -> prepare($sql);
    $flag=$result -> execute();
    $success['infoCode'] = $flag;
  }

  echo json_encode($success);

 ?>
