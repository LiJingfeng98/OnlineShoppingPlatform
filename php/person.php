<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  //type
  // 1.初始化   2.留言列表 3.提交留言 4.删除留言
  // 5.添加关注 6.新增封禁 7.检查封禁

  $type = $_GET['type'];

  if($type==1){
    $uid = $_GET['uid'];
    // 获取用户信息
    $sql = "select * from (select userid,userName,userimg,custom from userinfo where userid = ".$uid.") a left join introduce b on a.userid = b.userid";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(2,$uname);
    $result -> bindColumn(3,$uimg);
    $result -> bindColumn(4,$bgimg);
    $result -> bindColumn(6,$introduce);
    $result->fetch(PDO::FETCH_COLUMN);
    $info = [];
    $info = array('uname'=>$uname,'uimg'=>$uimg,'bgimg'=>$bgimg,'introduce'=>$introduce);
    //获取用户库存和评价数量
    $sql ="select * from (select count(*) as num from warehouse where userid =".$uid.") a inner join (select count(*) as num2 from goodcomment where userid = ".$uid.") b";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$wsum);
    $result -> bindColumn(2,$csum);
    $result->fetch(PDO::FETCH_COLUMN);
    $info['wsum'] = $wsum;
    $info['csum'] = $csum;
    $success['userInfo'] = $info;

    //获取最近购买
    $sql ="select a.goodid,goodname,time from (select goodid,time from warehouse where userid = ".$uid." order by time desc limit 1) a inner join goodinfo b where a.goodid = b.goodid ";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$gid);
    $result -> bindColumn(2,$gname);
    $result -> bindColumn(3,$time);
    $info = [];
    if($result->fetch(PDO::FETCH_COLUMN)){
      //查询商品类别
      $sql = "select * from goodType where goodID = ".$gid." order by Num desc limit 4;";
      $info2 = [];
      $result2 = $pdo -> prepare($sql);
      $result2 -> execute();
      $result2 -> bindColumn(2,$gtype);
      for($j=0;$result2->fetch(PDO::FETCH_COLUMN);$j++){
        $info2[$j]=$gtype;
      }
      $info = array('gid'=>$gid,'gname'=>$gname,'time'=>$time,'gtype'=>$info2,'infoCode'=>1);
    }else{
      $info = array('infoCode'=>0);
    }
    $success['recentBuy'] = $info;

    //查询最近评论
    $sql = "select a.goodid,goodname,type,time,comment from (select goodid,type,time,comment from goodcomment where userid = ".$uid." order by time desc limit 1) a inner join goodinfo b where a.goodid = b.goodid";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$gid);
    $result -> bindColumn(2,$gname);
    $result -> bindColumn(3,$type);
    $result -> bindColumn(4,$time);
    $result -> bindColumn(5,$comment);
    $info = [];
    if($result->fetch(PDO::FETCH_COLUMN)){
      $info = array('gid'=>$gid,'gname'=>$gname,'type'=>$type,'time'=>$time,'comment'=>$comment,'infoCode'=>1);
    }else{
      $info = array('infoCode'=>0);
    }
    $success['recentComment'] = $info;

  }
  else if($type==2){
      $uid = $_GET['uid'];
    if(!empty($_GET['page'])){
      $page = $_GET['page'];
    }
    $num = ($page-1)*6;
    // 获取总留言数 计算总页数
    $sql = "select count(*) from message where receiver = ".$uid;
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$sum);
    $result->fetch(PDO::FETCH_COLUMN);
    $sum /= 6;
    $success['maxPage'] = ceil($sum);
    //查询留言列表
    $sql = "select sender,username,userimg,time,message,id from (select * from message where receiver = ".$uid.") a inner join userinfo b where a.sender = b.userid limit ".$num.",6";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$uid);
    $result -> bindColumn(2,$uname);
    $result -> bindColumn(3,$uimg);
    $result -> bindColumn(4,$time);
    $result -> bindColumn(5,$message);
    $result -> bindColumn(6,$mid);
    $info = [];
    for($i=0;$result->fetch(PDO::FETCH_COLUMN);$i++){
      $info[$i] =
      array('uid'=>$uid,'uname'=>$uname,'uimg'=>$uimg,'time'=>$time,'message'=>$message,'mid'=>$mid);
    }
    $success['messageList'] = $info;
  }
  else if($type==3){
    $sender = $_GET['sender'];
    $receiver = $_GET['receiver'];
    $message = $_GET['message'];
    $date = date('Y-m-d');
    $sql = "insert into message(sender,receiver,time,message) values (?,?,?,?)";
    $halfPro = $pdo -> prepare($sql);
    // 将半成品通过execute方法传入参数，变成成品
    $halfPro ->bindValue(1,$sender);
    $halfPro ->bindValue(2,$receiver);
    $halfPro ->bindValue(3,$date);
    $halfPro ->bindValue(4,$message);
    $result = $halfPro -> execute();
  }
  else if($type==4){
    $mid = $_GET['mid'];
    $sql = "delete from message where id = ".$mid;
    $halfPro = $pdo -> prepare($sql);
    $result = $halfPro -> execute();
  }
  else if($type==5){
    $fid = $_GET['fid'];
    $uid = $_GET['uid'];
    $sql = "insert into userfriend values (".$uid.",".$fid.")";
    $result = $pdo -> prepare($sql);
    $flag=$result -> execute();
    $success['infoCode'] = $flag;
  }
  else if($type==6){
    $date = $_GET['date'];
    $uid = $_GET['uid'];
    // 判断是否存在
    $sql = "select * from userstate where userid = ?";
    $halfPro = $pdo -> prepare($sql);
    $halfPro ->bindValue(1,$uid);
    $halfPro -> execute();
    $numcount = $halfPro->rowCount();
    if($numcount != 0){
      // 存在 num++
      $sql = "update userstate set finish = ? where userid = ?";
      $halfPro = $pdo -> prepare($sql);
      $halfPro ->bindValue(1,$date);
      $halfPro ->bindValue(2,$uid);
      $result = $halfPro -> execute();
      $success['infoCode'] = $result;
    }
    else{
      // 不存在 新建
      $sql = "insert into userstate values (?,?);";
      $halfPro = $pdo -> prepare($sql);
      $halfPro ->bindValue(1,$uid);
      $halfPro ->bindValue(2,$date);
      $result = $halfPro -> execute();
      $success['infoCode'] = $result;
    }
  }
  else if($type==7){
    $uid = $_GET['uid'];
    // 判断是否存在
    $sql = "select finish from userstate where userid = ?";
    $halfPro = $pdo -> prepare($sql);
    $halfPro ->bindValue(1,$uid);
    $halfPro -> execute();
    $numcount = $halfPro->rowCount();
    if($numcount != 0){
      // 存在 判断比较
      $halfPro -> bindColumn(1,$odate);
      $halfPro->fetch(PDO::FETCH_COLUMN);
      $ndate = date('Y-m-d');
      $result = strtotime($ndate)<strtotime($odate);
      $success['infoCode'] = $result;
    }
    else{
      // 不存在 未封禁
      $success['infoCode'] = false;
    }
  }
  echo json_encode($success);

 ?>
