<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $loginName =$_POST['loginName'];
  $passWord =$_POST['passWord'];
  $nickName =$_POST['nickName'];
  $introduce =$_POST['introduce'];
  $bg =$_POST['bg'];
  $img =$_POST['img'];
  // infoCode 1插入成功。2昵称重复，3用户名重复
  $sql = "select count(*) from userinfo where username = ?";
  $halfPro = $pdo -> prepare($sql);
  $result = $halfPro -> execute([$nickName]);
  $halfPro -> bindColumn(1,$count);
  $halfPro->fetch(PDO::FETCH_COLUMN);
  if($count!=0){
    $success['infoCode'] = 2;
  }
  else{
    $sql = "select count(*) from userinfo where userloginname = ?";
    $halfPro = $pdo -> prepare($sql);
    $result = $halfPro -> execute([$loginName]);
    $halfPro -> bindColumn(1,$count);
    $halfPro->fetch(PDO::FETCH_COLUMN);
    if($count!=0){
      $success['infoCode'] = 3;
    }
    else{
      $sql = "insert into userinfo(userloginname,username,userpassword,grantp,balance,userimg,custom) values (?,?,?,0,0,?,?)";
      $halfPro = $pdo -> prepare($sql);
      $halfPro ->bindValue(1,$loginName);
      $halfPro ->bindValue(2,$nickName);
      $halfPro ->bindValue(3,$passWord);
      $halfPro ->bindValue(4,$img);
      $halfPro ->bindValue(5,$bg);
      if($result = $halfPro -> execute()){
        $success['infoCode'] = 1;
      }
      else{
        $success['infoCode'] = 0;
      }
    }
  }
  if($success['infoCode'] == 1){
    $sql = "select userid,username,grantp,balance,userimg,custom from userinfo where userloginname = ? and userpassword = ?";
    $halfPro = $pdo -> prepare($sql);
    $result = $halfPro -> execute([$loginName,$passWord]);
    $halfPro -> bindColumn(1,$userid);
    $halfPro -> bindColumn(2,$username);
    $halfPro -> bindColumn(3,$grantp);
    $halfPro -> bindColumn(4,$balance);
    $halfPro -> bindColumn(5,$userimg);
    $halfPro -> bindColumn(6,$custom);
    // flag 0查询失败，1查询成功
    $flag = 0;
    if($halfPro->fetch(PDO::FETCH_COLUMN)){
      $sql = "insert into introduce values(?,?)";
      $halfPro = $pdo -> prepare($sql);
      $result = $halfPro -> execute([$userid,$introduce]);
      setcookie('userid',$userid,time()+3600*24,'/');
      setcookie('username',$username,time()+3600*24,'/');
      setcookie('grantp',$grantp,time()+3600*24,'/');
      setcookie('balance',$balance,time()+3600*24,'/');
      setcookie('userimg',$userimg,time()+3600*24,'/');
      setcookie('custom',$custom,time()+3600*24,'/');
      $flag = 1;
    }
    $success['login'] = $flag;
  }
  echo json_encode($success);



?>
