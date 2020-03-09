var gid = 0;
var uname;
(function init() {
  // 获取cookie 登录状态
  cookieObj = getCookieObj();
  if (cookieObj.grantp != '1') {
    alert("只有管理员可以访问该页面！");
    window.location.href = 'index.html';
    return;
  } else {
    //获取gid参数（get方法）
    if (getQueryVariable('gid')) {
      gid = getQueryVariable('gid');
    }
  }

  // 初始表格内容
  $.ajax({
    type: 'get',
    url: 'php/editGood.php',
    dataType: 'json',
    data: {
      gid: gid,
      type: 1
    },
    success: function(res) {
      if (res.infoCode == 1) {
        var goodInfo = res.goodInfo;
        $('#inputGoodName').val(goodInfo.gname);
        $('#inputOwner').val(goodInfo.owner);
        $('#inputRDate').val(goodInfo.rdate);
        $('#inputPrice').val(goodInfo.price);
        $('#inputDetail').val(goodInfo.detail);
        $('#inputDiscount').val(goodInfo.discount);
        $('#num').html(goodInfo.discount + "折 -- " + Math.ceil(goodInfo.price * goodInfo.discount) + "￥");
        $('#inputGoodImg').val(goodInfo.gimg);
        $("input:radio[value=" + goodInfo.gtype + "]").attr('checked', 'true');


      } else {
        alert("该商品不存在");
        window.location.href = 'index.html';
        return;
      }
    },
    error: function(e) {
      alert(e.responseText);
    }
  }); //ajax end

  //滑块滑动事件
  $('#inputDiscount').change(function showDis() {
    $('#num').html($('#inputDiscount').val() + "折 -- " + Math.ceil($('#inputPrice').val() * $('#inputDiscount').val()) + "￥");
  });

  //提交事件
  $('#save').click(function() {
    var gname = $('#inputGoodName').val();
    var owner = $('#inputOwner').val();
    var rdate = $('#inputRDate').val();
    var price = $('#inputPrice').val();
    var discount = $('#inputDiscount').val();
    var gtype = $('input[name="gtype"]:checked').val();
    var detail = $('#inputDetail').val();
    if (owner.trim().length == 0 || rdate.trim().length == 0 || price.trim().length == 0 || detail.trim().length == 0) {
      alert('内容不能为空！请检查后重新输入！');
      return;
    }
    // 发送ajax请求去后台
    $.ajax({
      type: 'get',
      url: 'php/editGood.php',
      dataType: 'json',
      data: {
        gid: gid,
        gname: gname,
        owner: owner,
        rdate: rdate,
        price: price,
        discount: discount,
        gtype: gtype,
        detail: detail,
        type: 2
      },
      success: function(res) {
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

//获取get参数方法
function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
};
