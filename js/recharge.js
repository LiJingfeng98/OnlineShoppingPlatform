var uid;
var cookieObj = getCookieObj();
if (typeof(cookieObj.userid) != "undefined") {
  uid=cookieObj.userid
}else{
  alert("请登录后再充值！");
  window.location.href = 'index.html';
}
  $('#charge').click(function() {
    var chargeNum = $('#chargeNum').val();
    //判空操作
    if (chargeNum.trim().length == 0) {
      alert('金额不能为空，请重新输入！');
      return;
    } else if (chargeNum < 0) {
      alert('金额不能为负数，请重新输入！');
      return;
    }
    //发送ajax请求去后台
    $.ajax({
      type: 'post',
      url: 'php/recharge.php',
      dataType: 'json',
      data: {
        uid: uid,
        chargeNum: chargeNum
      },
      success: function(res) {
        alert("充值成功！");
        location.reload();
        window.location.href = 'index.html';
      },
      error: function(e) {
        alert(e.responseText);
      }
    });
    //发送请求完毕后，初始化输入框，等待下一次操作。
    $('#chargeNum').val('');
  });

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
  }
