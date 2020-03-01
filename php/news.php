<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $page = $_GET['page'];
  $num = ($page-1)*8;
  // 获取总页数
  $sql = "select count(*) from news";
  $result = $pdo -> prepare($sql);
  $result -> execute();
  $result -> bindColumn(1,$nums);
  $result->fetch(PDO::FETCH_COLUMN);
  $success['nums'] = $nums;
  $nums /= 8;
  $success['maxPage'] = ceil($nums);

  //获取商品列表数据
  $sql = "select id,title,time from news order by time desc limit ".$num.",8";
  //因为需要从数据库中读取数据，所以采用pdo的预处理语句
  $result = $pdo -> prepare($sql);
  $result -> execute();
  //数据绑定，便于在循环遍历中读取查询结果
  $result -> bindColumn(1,$id);
  $result -> bindColumn(2,$title);
  $result -> bindColumn(3,$time);
  //通过预处理语句得到的$result就包含了所有的结果
  $info = [];
  for($i=0;$row=$result->fetch(PDO::FETCH_COLUMN);$i++){
    $info[$i] = array('id'=>$id,'title'=>$title,'time'=>$time);
  }

  $success['newsListInfo'] = $info;
  echo json_encode($success);

 ?>
