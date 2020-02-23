<?php

  $success = array('msg'=>'OK');

  setcookie('username','',time()-1,'/OnlineShoppingPlatform');
  setcookie('userid','',time()-1,'/OnlineShoppingPlatform');
  setcookie('balance','',time()-1,'/OnlineShoppingPlatform');
  setcookie('custom','',time()-1,'/OnlineShoppingPlatform');
  setcookie('grantp','',time()-1,'/OnlineShoppingPlatform');
  setcookie('userimg','',time()-1,'/OnlineShoppingPlatform');
  echo json_encode($success);
 ?>
