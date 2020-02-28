var bg = "bg1.jpg";
var img = "head";
(function init() {

  //登录事件
  $('#login').click(function() {
    // 密码一致校验
    var passWord = $('#inputPassword').val();
    var passWord1 = $('#inputPassword1').val();
    if (passWord != passWord1) {
      alert("两次输入密码不同，请重新输入！");
      return;
    }
    var loginName = $('#inputLoginName').val();
    var nickName = $('#inputNickName').val();
    //判空操作
    if (loginName.trim().length == 0 || passWord.trim().length == 0 || nickName.trim().length == 0) {
      alert('用户名、昵称、密码不能为空！请检查后重新输入！');
      return;
    }
    var introduce = $('#inputIntroduce').val();

    // 发送ajax请求去后台
    $.ajax({
      type: 'post',
      url: 'php/register.php',
      dataType: 'json',
      data: {
        loginName: loginName,
        nickName: nickName,
        passWord: passWord,
        introduce: introduce,
        bg: bg,
        img: img
      },
      success: function(res) {
        console.log(res);
        if (res.infoCode == 1) {
          alert("注册成功，转入主页。");
          if(res.login ==1){
            alert("自动登入成功！");
          }
          else{
            alert("未能自动登入。");
          }
          window.location.href = 'index.html';
        }
        else if (res.infoCode == 2) {
          alert("昵称重复，请重新输入");
        }
        else if (res.infoCode == 3) {
          alert("用户名重复，请重新输入");
        }
        else if (res.infoCode == 0) {
          alert("未知错误");
        }
      },
      error: function(e) {
        alert(e.responseText);
      }
    }); //ajax end
    // 发送请求完毕后，初始化输入框，等待下一次操作。
    $('#inputLoginName').val('');
    $('#inputPassword').val('');
    $('#inputPassword1').val('');
    $('#inputNickName').val('');
    $('#inputIntroduce').val('');
  }); //login.click end


})(); //init end

function bgChange(path) {
  bg = path;
  $('#myModal').modal('hide');
  $('#bgPic').attr('src', "img/bg/sm" + bg);
  var name;
  switch (bg) {
    case 1:
      name = "WILL：A Wonderful World";
      break;
    case 2:
      name = "BG03 Little Painter Tricolour Lovestory";
      break;
    case 3:
      name = "Hentai Girl";
      break;
    default:
      name = "NULL";
  }
  $('#bgName').html(name);
}

function imgChange(name) {
  img = name;
  $('#myModal2').modal('hide');
  $('#headPic').attr('src', "img/headimg/" + img + ".jpg");
  $('#headName').html(img);
}
