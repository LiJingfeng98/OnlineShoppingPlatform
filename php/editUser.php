<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $type = $_GET['type'];
  $uid = $_GET['uid'];
  if($type == 1){
    // 个人信息获取
    $sql = "select username,userimg,custom from userinfo where userid = ?";
    $halfPro = $pdo -> prepare($sql);
    $result = $halfPro -> execute([$uid]);
    $halfPro -> bindColumn(1,$uname);
    $halfPro -> bindColumn(2,$uimg);
    $halfPro -> bindColumn(3,$custom);
    if($halfPro->fetch(PDO::FETCH_COLUMN)){
      $sql = "select introduce from introduce where userid = ?";
      $halfPro2 = $pdo -> prepare($sql);
      $result2 = $halfPro2 -> execute([$uid]);
      $halfPro2 -> bindColumn(1,$introduce);
      $halfPro2->fetch(PDO::FETCH_COLUMN);
      $info = array('uname'=>$uname,'uimg'=>$uimg,'custom'=>$custom,'introduce'=>$introduce);
      $success['userInfo'] = $info;
      $success['infoCode'] = 1;
    }
    // 未查询到结果
    else {
      $success['infoCode'] = 0;
    }
  }
  else if($type == 2){
    // 更新用户数据
    $passWord =$_GET['passWord'];
    $nickName =$_GET['nickName'];
    $introduce =$_GET['introduce'];
    $bg =$_GET['bg'];
    $img =$_GET['img'];
    // infoCode 1更新成功，0失败
    $sql = "update userinfo set username = ?,userpassword = ?,userimg = ?,custom = ? where userid = ?";
    $halfPro = $pdo -> prepare($sql);
    $halfPro -> bindValue(1,$nickName);
    $halfPro -> bindValue(2,$passWord);
    $halfPro -> bindValue(3,$img);
    $halfPro -> bindValue(4,$bg);
    $halfPro -> bindValue(5,$uid);
    if($result = $halfPro -> execute()){
      $sql = "update introduce set introduce = ? where userid = ?";
      $halfPro = $pdo -> prepare($sql);
      $result = $halfPro -> execute([$introduce,$uid]);
      $success['infoCode'] = 1;
    }
    else{
      $success['infoCode'] = 0;
    }
  if($success['infoCode'] == 1){
    $sql = "select * from userinfo where userid = ?";
    $halfPro = $pdo -> prepare($sql);
    $result = $halfPro -> execute([$uid]);
    $halfPro -> bindColumn(1,$userid);
    $halfPro -> bindColumn(3,$username);
    $halfPro -> bindColumn(5,$grantp);
    $halfPro -> bindColumn(6,$balance);
    $halfPro -> bindColumn(7,$userimg);
    $halfPro -> bindColumn(8,$custom);
    // flag 0查询失败，1查询成功
    $flag = 0;
    if($halfPro->fetch(PDO::FETCH_COLUMN)){
      $sql = "insert into introduce values(?,?)";
      $halfPro = $pdo -> prepare($sql);
      $result = $halfPro -> execute([$userid,$introduce]);
      setcookie('userid',$userid,time()+3600*24,'/onlineshoppingplatform');
      setcookie('username',$username,time()+3600*24,'/onlineshoppingplatform');
      setcookie('grantp',$grantp,time()+3600*24,'/onlineshoppingplatform');
      setcookie('balance',$balance,time()+3600*24,'/onlineshoppingplatform');
      setcookie('userimg',$userimg,time()+3600*24,'/onlineshoppingplatform');
      setcookie('custom',$custom,time()+3600*24,'/onlineshoppingplatform');
      $flag = 1;
    }
    $success['login'] = $flag;
  }
}


  echo json_encode($success);



?>
