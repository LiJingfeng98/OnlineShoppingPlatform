var bg = "bg1.jpg";
var img = "head";
var uid;
var uname;
(function init() {
  // 获取cookie 登录状态
  cookieObj = getCookieObj();
  if (typeof(cookieObj.username) == "undefined") {
    alert("请先登录后再访问该页面！");
    window.location.href = 'index.html';
    return;
  } else {
    uid = cookieObj.userid;
    uname = decodeURI(cookieObj.username);
  }

  // 初始表格内容
  $.ajax({
    type: 'get',
    url: 'php/editUser.php',
    dataType: 'json',
    data: {
      uid: uid,
      type: 1
    },
    success: function(res) {
      if (res.infoCode == 1) {
        var userInfo = res.userInfo;
        $('#inputNickName').val(userInfo.uname);
        $('#inputIntroduce').val(userInfo.introduce);
        bgChange(userInfo.custom);
        imgChange(userInfo.uimg);
      }
      else {
        alert("该用户不存在");
        window.location.href = 'index.html';
        return;
      }
    },
    error: function(e) {
      alert(e.responseText);
    }
  }); //ajax end


  //提交事件
  $('#login').click(function() {
    // 密码一致校验
    var passWord = $('#inputPassword').val();
    var passWord1 = $('#inputPassword1').val();
    if (passWord != passWord1) {
      alert("两次输入密码不同，请重新输入！");
      return;
    }
    var nickName = $('#inputNickName').val();
    //判空操作
    if (passWord.trim().length == 0 || nickName.trim().length == 0) {
      alert('昵称、密码不能为空！请检查后重新输入！');
      return;
    }
    var introduce = $('#inputIntroduce').val();

    // 发送ajax请求去后台
    $.ajax({
      type: 'get',
      url: 'php/editUser.php',
      dataType: 'json',
      data: {
        uid:uid,
        nickName: nickName,
        passWord: passWord,
        introduce: introduce,
        bg: bg,
        img: img,
        type:2
      },
      success: function(res) {
        console.log(res);
        if (res.infoCode == 1) {
          alert("更新成功，转入主页。");
          window.location.href = 'index.html';
        } else {
          alert("未知错误");
          console.log(res);
        }
      },
      error: function(e) {
        alert(e.responseText);
      }
    }); //ajax end
  }); //login.click end


})(); //init end

function bgChange(path) {
  bg = path;
  $('#myModal').modal('hide');
  $('#bgPic').attr('src', "img/bg/sm" + bg);
  var name;
  switch (bg) {
    case 'bg1.jpg':
      name = "WILL：A Wonderful World";
      break;
    case 'bg2.jpg':
      name = "BG03 Little Painter Tricolour Lovestory";
      break;
    case 'bg3.jpg':
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

// 读取cookie
function getCookieObj() {
  var cookieObj = {},
    cookieSplit = [],
    // 以分号（;）分组
    cookieArr = document.cookie.split(";");
  for (var i = 0, len = cookieArr.length; i < len; i++)
    if (cookieArr[i]) {
      // 以等号（=）分组
      cookieSplit = cookieArr[i].split("=");
      // Trim() 是自定义的函数，用来删除字符串两边的空格
      cookieObj[cookieSplit[0].trim()] = cookieSplit[1].trim();
    }
  return cookieObj;
};
