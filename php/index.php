<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  //
  $sql = 'select * from goodinfo order by Rdate desc limit 3';
  //因为需要从数据库中读取数据，所以采用pdo的预处理语句
  $result = $pdo -> prepare($sql);
  $result -> execute();
  //数据绑定，便于在循环遍历中读取查询结果
  $result -> bindColumn(1,$gid);
  $result -> bindColumn(2,$gname);
  $result -> bindColumn(6,$gprice);
  //通过预处理语句得到的$result就包含了所有的结果
  $info = [];
  for($i=0;$result->fetch(PDO::FETCH_COLUMN);$i++){
    $info[$i] = array('gid'=>$gid,'gname'=>$gname,'gprice'=>$gprice);
  }
  //将索引到的数据放入$success中并进行返回
  $success['carouselInfo'] = $info;

  echo json_encode($success);

 ?>
