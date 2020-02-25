<?php

  $success = array('msg'=>'OK');

  setcookie('username','',time()-1,'/onlineshoppingplatform');
  setcookie('userid','',time()-1,'/onlineshoppingplatform');
  setcookie('balance','',time()-1,'/onlineshoppingplatform');
  setcookie('custom','',time()-1,'/onlineshoppingplatform');
  setcookie('grantp','',time()-1,'/onlineshoppingplatform');
  setcookie('userimg','',time()-1,'/onlineshoppingplatform');
  echo json_encode($success);
 ?>
