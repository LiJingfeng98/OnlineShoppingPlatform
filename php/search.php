<?php
  $success = array('msg' => 'OK');
  //匹配数据部分
  require_once("PDOsingleton.php");
  $pdo = PDOsingleton::getPdo();
  $item = '';
  $type = 1;
  $page = 1;
  if(!empty($_GET['page'])){
    $page = $_GET['page'];
  }
  if(!empty($_GET['item'])){
    $item = $_GET['item'];
  }
  if(!empty($_GET['type'])){
    $type = $_GET['type'];
  }
  $num = ($page-1)*8;
  // 获取总页数 计算评论页数
  $sql = "select count(*) from (select * from (select a.goodID,goodname,type from goodinfo a inner join goodtype b where a.goodid = b.goodid) a where goodname like \"%".$item."%\" or type like \"%".$item."%\" group by goodid) a";
  $result = $pdo -> prepare($sql);
  $result -> execute();
  $result -> bindColumn(1,$gnums);
  $result->fetch(PDO::FETCH_COLUMN);
  $success['gnums'] = $gnums;
  $gnums /= 8;
  $success['maxPage'] = ceil($gnums);




  //获取商品列表数据
  $sqlType = '';
  //销量排序1，最新排序2，价格降序3，价格升序4
  switch ($type) {
    case 1:$sqlType = 'order by sum desc';
    break;
    case 2:$sqlType = 'order by rdate desc';
    break;
    case 3:$sqlType = 'order by price desc';
    break;
    case 4:$sqlType = 'order by price asc';
    break;
    default:
      // code...
      break;
  }

  $sql = "select a.goodID,goodname,price,sum,Rdate from (select * from (select a.goodID,goodname,price,type,Rdate from goodinfo a inner join goodtype b where a.goodid = b.goodid) a where goodname like \"%".$item."%\" or type like \"%".$item."%\" group by goodid) a inner join (select count(*) as sum,goodID from warehouse group by goodID order by sum desc) b where a.goodID = b.goodID ".$sqlType." limit ".$num.",8";
  //因为需要从数据库中读取数据，所以采用pdo的预处理语句
  $result = $pdo -> prepare($sql);
  $result -> execute();
  //数据绑定，便于在循环遍历中读取查询结果
  $result -> bindColumn(1,$gid);
  $result -> bindColumn(2,$gname);
  $result -> bindColumn(3,$gprice);
  //通过预处理语句得到的$result就包含了所有的结果
  $info = [];
  for($i=0;$row=$result->fetch(PDO::FETCH_COLUMN);$i++){
    // 获取类别
    $sql = "select * from goodType where goodID = ".$gid." order by Num desc limit 3;";
    $info2 = [];
    $result2 = $pdo -> prepare($sql);
    $result2 -> execute();
    $result2 -> bindColumn(2,$gtype);
    for($j=0;$result2->fetch(PDO::FETCH_COLUMN);$j++){
      $info2[$j]=$gtype;
    }
    $info[$i] = array('gid'=>$gid,'gname'=>$gname,'gprice'=>$gprice,'gtype'=>$info2);
  }

  $success['goodListInfo'] = $info;
  echo json_encode($success);

 ?>
