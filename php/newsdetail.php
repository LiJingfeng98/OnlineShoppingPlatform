<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $nid = $_GET['nid'];
  //获取商品列表数据
  $sql = "select title,time,detail from news where id = ".$nid;
  //因为需要从数据库中读取数据，所以采用pdo的预处理语句
  $result = $pdo -> prepare($sql);
  $result -> execute();
  //数据绑定，便于在循环遍历中读取查询结果
  $result -> bindColumn(1,$title);
  $result -> bindColumn(2,$time);
  $result -> bindColumn(3,$detail);
  //通过预处理语句得到的$result就包含了所有的结果
  if($result->fetch(PDO::FETCH_COLUMN)){
    $info= array('detail'=>$detail,'title'=>$title,'time'=>$time);
    $success['newsInfo'] = $info;
    $success['infoCode'] = 1;
  }
  else{
    $success['infoCode'] = 0;
  }
  echo json_encode($success);

 ?>
