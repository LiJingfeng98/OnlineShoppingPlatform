var gid = 0;
var uname;
(function init() {
  // 获取cookie 登录状态
  cookieObj = getCookieObj();
  if (cookieObj.grantp != '1') {
    alert("只有管理员可以访问该页面！");
    window.location.href = 'index.html';
    return;
  }
  //提交事件
  $('#save').click(function() {
    var title = $('#inputTitle').val();
    var time = $('#inputTime').val();
    var detail = $('#inputDetail').val();
    if (title.trim().length == 0 || time.trim().length == 0 || detail.trim().length == 0) {
      alert('内容不能为空！请检查后重新输入！');
      return;
    }
    // 发送ajax请求去后台
    $.ajax({
      type: 'get',
      url: 'php/addNews.php',
      dataType: 'json',
      data: {
        title: title,
        time: time,
        detail: detail
      },
      success: function(res) {
        if (res.infoCode == 1) {
          alert("新增成功，转入主页。");
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
