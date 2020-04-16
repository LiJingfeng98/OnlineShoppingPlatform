<?php

  $success = array('msg'=>'OK');

  setcookie('username','',time()-1,'/');
  setcookie('userid','',time()-1,'/');
  setcookie('balance','',time()-1,'/');
  setcookie('custom','',time()-1,'/');
  setcookie('grantp','',time()-1,'/');
  setcookie('userimg','',time()-1,'/');
  echo json_encode($success);
 ?>
