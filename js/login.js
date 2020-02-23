;
(function() {
  //注销事件
  $('.header-menu').find('.btn_hidden').click(function() {
    $('.header-menu').find('.menu').css('display', 'inline-block');
    $('.header-menu').find('.ahidden').css('display', 'none');
    $('.header-menu').find('.ahidden').html('你好！');
    $('.header-menu').find('.btn_hidden').css('display', 'none');
  });

  //登录事件
  $('#login').click(function() {
    var loginName = $('#inputLoginName').val();
    var passWord = $('#inputPassword').val();
    //判空操作
    if (loginName.trim().length == 0 || passWord.trim().length == 0) {
      alert('用户名或密码不能为空！请检查后重新输入！');
      return;
    }
    //发送ajax请求去后台
    $.ajax({
      type: 'post',
      url: 'php/login.php',
      dataType: 'json',
      data: {
        loginName: loginName,
        passWord: passWord
      },
      success: function(res) {
        if(res.infoCode==0){
          $('#message').css('display', 'inline-block');
        }
        else if(res.infoCode==1){
          $('#message').css('display', 'none');
          window.location.href = 'index.html';
        }
        // switch (res.infoCode) {
        //   case 0:
        //     //需要做的是变更页面结构
        //     alert("登录成功");
        //     $('.header-menu').find('.menu').css('display', 'none');
        //     $('.header-menu').find('.ahidden').css('display', 'inline-block');
        //     $('.header-menu').find('.ahidden').html('欢迎回来！' + res.showUserName);
        //     $('.header-menu').find('.btn_hidden').css('display', 'inline-block');
        //     break;
        //   case 1:
        //     alert('登录失败！用户名或密码错误！');
        //     break;
        //   case 2:
        //     alert('登录失败！网络连接错误！');
        //     break;
        //   case 3:
        //     alert('登录失败！该用户名不存在！');
        //     break;
        //   default:
        //     alert('未知错误！');
        // }
      },
      error: function(e) {
        alert(e.responseText);
      }
    });
    //发送请求完毕后，初始化输入框，等待下一次操作。
    $('#inputLoginName').val('');
    $('#inputPassword').val('');
  });


})();
