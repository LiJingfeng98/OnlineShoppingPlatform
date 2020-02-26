
(function() {
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
        console.log(res);
        if(res.infoCode==0){
          $('#message').css('display', 'inline-block');
        }
        else if(res.infoCode==1){
          $('#message').css('display', 'none');
          window.location.href = 'index.html';
        }
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
