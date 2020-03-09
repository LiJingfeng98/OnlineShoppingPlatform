<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $page = 1;
  $type = 1;//1为新品排序，2为销量排序


  //获取轮播数据
  $sql = 'select goodid,goodname,price,discount,goodimg from goodinfo order by Rdate desc limit 3';
  //因为需要从数据库中读取数据，所以采用pdo的预处理语句
  $result = $pdo -> prepare($sql);
  $result -> execute();
  //数据绑定，便于在循环遍历中读取查询结果
  $result -> bindColumn(1,$gid);
  $result -> bindColumn(2,$gname);
  $result -> bindColumn(3,$gprice);
  $result -> bindColumn(4,$discount);
  $result -> bindColumn(5,$gimg);
  //通过预处理语句得到的$result就包含了所有的结果
  $info = [];
  for($i=0;$result->fetch(PDO::FETCH_COLUMN);$i++){
    $info[$i] = array('gid'=>$gid,'gname'=>$gname,'gprice'=>$gprice,'discount'=>$discount,'gimg'=>$gimg);
  }
  //将索引到的数据放入$success中并进行返回
  $success['carouselInfo'] = $info;


  //获取商品列表 1为新品排序，2为销量排序
    $page = $_GET['page'];
    $type = $_GET['type'];
  $num = ($page-1)*8;
  // sql
  if($type == 1){
    $sql = "select goodid,goodname,price,discount,goodimg from goodinfo order by RDate desc limit $num,8";
  }else if($type == 2){
    $sql = "select a.goodid,goodname,price,discount,goodimg from goodinfo a INNER JOIN (select COUNT(GoodID),goodID from possessions group by goodid order by COUNT(GoodID) desc) b ON a.goodid = b.goodid limit $num,8";
  }

  $result = $pdo -> prepare($sql);
  $result -> execute();
  $result -> bindColumn(1,$gid);
  $result -> bindColumn(2,$gname);
  $result -> bindColumn(3,$gprice);
  $result -> bindColumn(4,$discount);
  $result -> bindColumn(5,$gimg);
  $info = [];
  for($i=0;$result->fetch(PDO::FETCH_COLUMN);$i++){
    // 获取类别
    $sql = "select type from goodType where goodID = ".$gid." order by Num desc limit 3;";
    $info2 = [];
    $result2 = $pdo -> prepare($sql);
    $result2 -> execute();
    $result2 -> bindColumn(1,$gtype);
    for($j=0;$result2->fetch(PDO::FETCH_COLUMN);$j++){
      $info2[$j]=$gtype;
    }

    $info[$i] = array('gid'=>$gid,'gname'=>$gname,'gprice'=>$gprice,'discount'=>$discount,'gimg'=>$gimg,'gtype'=>$info2);
  }
  //将索引到的数据放入$success中并进行返回
  $success['goodListInfo'] = $info;

  // 获取总页数
  $sql = 'select count(goodId) from goodinfo';
  $result = $pdo -> prepare($sql);
  $result -> execute();
  $result -> bindColumn(1,$sum);
  $result->fetch(PDO::FETCH_COLUMN);
  $sum /= 8;
  $success['maxPage'] = ceil($sum);



  echo json_encode($success);

 ?>
