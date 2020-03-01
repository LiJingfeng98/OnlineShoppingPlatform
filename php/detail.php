<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $gid = 1;
  $page = 1;
  // type:
  // 1.初始化  2.评价列表  3.提交评论
  $type = $_GET['type'];
  $gid = $_GET['gid'];

  if($type==1){
    // 获取总页数 计算评论页数
    $sql = "select count(userid) from goodcomment where goodid = $gid";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$sum);
    $result->fetch(PDO::FETCH_COLUMN);
    $sum /= 4;
    $success['maxPage'] = ceil($sum);

    //获取单项商品数据
    $sql = "select * from goodinfo where goodid = '$gid'";
    //因为需要从数据库中读取数据，所以采用pdo的预处理语句
    $result = $pdo -> prepare($sql);
    $result -> execute();
    //数据绑定，便于在循环遍历中读取查询结果
    $result -> bindColumn(1,$gid);
    $result -> bindColumn(2,$gname);
    $result -> bindColumn(4,$gowner);
    $result -> bindColumn(5,$gdate);
    $result -> bindColumn(6,$gprice);
    $result -> bindColumn(7,$gdetail);
    //通过预处理语句得到的$result就包含了所有的结果
    $info = [];
    $result->fetch(PDO::FETCH_COLUMN);
    $info[0] = array('gid'=>$gid,'gname'=>$gname,'gprice'=>$gprice,'gowner'=>$gowner,'gdate'=>$gdate,'gdetail'=>$gdetail);
    $success['goodInfo'] = $info;

    //获取商品类别
    $sql = "select type from goodtype where goodid = $gid order by Num desc limit 6 ";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$gtype);
    $info = [];
    for($i=0;$row=$result->fetch(PDO::FETCH_COLUMN);$i++){
        $info[$i] = $gtype;
    }
    $success['gtypelist'] = $info;

    //获取商品评论数及好评计算
    $sql = "select count(goodid) as gsum, SUM(Type) as tsum from goodcomment where goodId = '$gid'";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(1,$gsum);
    $result -> bindColumn(2,$tsum);
    $result->fetch(PDO::FETCH_COLUMN);
    if($gsum==0||$gsum==0){
      $typeCode =5;
    }
    else{
      $flag = $tsum/$gsum;
      $typeCode = 0;//1为特别好评 ，2为多半好评，3为褒贬不一，4为多半差评,5为暂未明确
      $info = [];
      if($flag>0.75){
        $typeCode = 1;
      }else if($flag>0.5){
        $typeCode = 2;
      }else if($flag>0.25){
        $typeCode = 3;
      }else{
        $typeCode = 4;
      }
    }

    $info[0] = array('typeCode'=>$typeCode,'gsum'=>$gsum);
    $success['commentType'] = $info;
  }
  else if($type==2){
    if(!empty($_GET['page'])){
      $page = $_GET['page'];
    }
    $num = ($page-1)*4;
    // 获取评论
    $sql = "select * from goodcomment where goodid = '$gid' order by time desc limit $num,4";
    $result = $pdo -> prepare($sql);
    $result -> execute();
    $result -> bindColumn(2,$uid);
    $result -> bindColumn(3,$ctype);
    $result -> bindColumn(4,$ctime);
    $result -> bindColumn(5,$comment);
    $info = [];
    for($i=0;$row=$result->fetch(PDO::FETCH_COLUMN);$i++){
      $info[$i] = array('uid'=>$uid,'ctyp'=>$ctype,'ctime'=>$ctime,'comment'=>$comment);
      //user名称 图片
      $sql = "select username,userimg from userinfo where userid = $uid";
      $result1 = $pdo -> prepare($sql);
      $result1 -> execute();
      $result1 -> bindColumn(1,$uname);
      $result1 -> bindColumn(2,$uimg);
      $result1 ->fetch(PDO::FETCH_COLUMN);
      $info[$i]['uname'] = $uname;
      $info[$i]['uimg'] = $uimg;

      //user有几个产品
      $sql = "select count(userID) from warehouse where userid = $uid";
      $result2 = $pdo -> prepare($sql);
      $result2 -> execute();
      $result2 -> bindColumn(1,$ugnum);
      $result2 ->fetch(PDO::FETCH_COLUMN);
      $info[$i]['ugum'] = $ugnum;
      //user有几个评论
      $sql = "select count(userID) from goodcomment where userid = $uid";
      $result3 = $pdo -> prepare($sql);
      $result3 -> execute();
      $result3 -> bindColumn(1,$ucnum);
      $result3 ->fetch(PDO::FETCH_COLUMN);
      $info[$i]['ucnum'] = $ucnum;
    }
    $success['commentInfoList'] = $info;
  }
  else if($type==3){
    $gid = $_GET['gid'];
    $uid = $_GET['uid'];
    $ctype = $_GET['ctype'];
    $comment = $_GET['comment'];
    $date = date('Y-m-d');
    $sql = "insert into goodcomment values(?,?,?,?,?)";
    $halfPro = $pdo -> prepare($sql);
    // 将半成品通过execute方法传入参数，变成成品
    $halfPro ->bindValue(1,$gid);
    $halfPro ->bindValue(2,$uid);
    $halfPro ->bindValue(3,$ctype);
    $halfPro ->bindValue(4,$date);
    $halfPro ->bindValue(5,$comment);
    $result = $halfPro -> execute();
  }
  else if($type==4){
    $uid = $_GET['uid'];
    $sql = "delete from goodcomment where goodid=".$gid." and userid =".$uid;
    $halfPro = $pdo -> prepare($sql);
    $result = $halfPro -> execute();
  }
  else if($type==5){
    $inputType = $_GET['inputType'];
    $gid = $_GET['gid'];
    // 判断是否存在
    $sql = "select num from goodtype where goodid = ? and type = ?";
    $halfPro = $pdo -> prepare($sql);
    $halfPro ->bindValue(1,$gid);
    $halfPro ->bindValue(2,$inputType);
    $halfPro -> execute();
    $numcount = $halfPro->rowCount();
    if($numcount != 0){
      // 存在 num++
      $halfPro -> bindColumn(1,$num);
      $halfPro->fetch(PDO::FETCH_COLUMN);
      $num++;
      $sql = "update goodtype set num = ? where goodid = ? and type = ?";
      $halfPro = $pdo -> prepare($sql);
      $halfPro ->bindValue(1,$num);
      $halfPro ->bindValue(2,$gid);
      $halfPro ->bindValue(3,$inputType);
      $result = $halfPro -> execute();
      $success['infoCode'] = $result;
    }
    else{
      // 不存在 新建
      $sql = "insert into goodtype values (?,?,1)";
      $halfPro = $pdo -> prepare($sql);
      $halfPro ->bindValue(1,$gid);
      $halfPro ->bindValue(2,$inputType);
      $result = $halfPro -> execute();
      $success['infoCode'] = $result;
    }
  }

  echo json_encode($success);

 ?>
