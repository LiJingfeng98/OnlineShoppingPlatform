<?php
  class PDOsingleton{
    private static $pdo = null;
    public static function getPdo(){
      if(self::$pdo == null){
        //创建一个PDO
        try{
          self::$pdo = new PDO('mysql:host=localhost;dbname=onlineshoppingplatform;charset=UTF8','root','');
        }catch(PDOException $e){
          echo '连接错误，信息为：'.$e->getMessage();
        }
      }
      return self::$pdo;
    }
  }

  $pdo1 = PDOsingleton::getPdo();
 ?>
