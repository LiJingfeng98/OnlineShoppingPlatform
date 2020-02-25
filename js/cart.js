var uid;
var username;
var totalPrice;
var flag = false;
var balance = 0;
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

(function init() {
  //获取uid参数（cookie）
  var cookieObj = getCookieObj();
  if (typeof(cookieObj.username) == "undefined") {
    alert("请登录后访问该页面");
    window.location.href = 'login.html';
  } else {
    username = decodeURI(cookieObj.username);
    uid = cookieObj.userid;
    balance = cookieObj.balance;
  }
  //直接进入页面后，自动发送ajax请求，等待数据回传之后直接加载到页面之
  loadCartList();
})();

//加载购物车列表
function loadCartList() {
  $.ajax({
    type: 'get',
    url: 'php/cart.php',
    dataType: 'json',
    data: {
      uid: uid,
      type: 1
    },
    success: function(res) {
      var cartListArr = res.cartListInfo;
      totalPrice = res.totalPrice;

      var uname = document.querySelector('#uname');
      uname.innerHTML = username + "的购物车";

      var cartList = document.querySelector('#cartList');
      innerHTML = "";
      for (var i = 0; i < cartListArr.length; i++) {
        //flag
        flag = true;
        //List
        innerType = '';
        innerHTML +=
          "    <li class=\"list-group-item\">" +
          "        <div class=\"media\">" +
          "          <div class=\"media-left media-middle\">" +
          "            <a href=\"detail.html?gid=" + cartListArr[i].gid + "\">" +
          "              <img src=\"img/" + cartListArr[i].gname + "/2x.jpg\" class=\"media-object \">" +
          "            </a>" +
          "          </div>" +
          "          <div class=\"media-body\">" +
          "            <a href=\"#\">" +
          "              <h4 class=\"media-heading\">" + cartListArr[i].gname + "</h4>" +
          "            </a>" +
          "            <p class=\"text-right\" style=\"font-size:18px;\">￥" + cartListArr[i].price + "</p>" +
          "            <a href=\"javascript:void(0);\" onclick=\"del(" + cartListArr[i].gid + ")\">" +
          "              <p class=\"text-right\">移除</p>" +
          "            </a>" +
          "          </div>" +
          "        </div>" +
          "      </li>";
      }
      if (flag) {
        cartList.innerHTML = innerHTML;

        var tPrice = document.querySelector('#totalPrice');
        tPrice.innerHTML = totalPrice + "￥";

        var buybtn = document.querySelector('#buybtn');
        buybtn.innerHTML =
          "<button type=\"button\" class=\"btn btn-success\" onclick=\"buy()\" >--购买--</button>";
      }
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};

// 删除单一商品
function del(goodid) {
  $.ajax({
    type: 'get',
    url: 'php/cart.php',
    dataType: 'json',
    data: {
      uid: uid,
      gid: goodid,
      type: 2
    },
    success: function(res) {
      location.reload();
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};

// 购买商品
function buy(){
  if(totalPrice>balance){
    alert("余额不足，请重置！");
  }else{
    $.ajax({
      type: 'get',
      url: 'php/cart.php',
      dataType: 'json',
      data: {
        uid: uid,
        type: 3
      },
      success: function(res) {
        if(res.infoCode==1){
          alert("购买成功！");
        }else if (res.infoCode==0) {
          alert("购买失败！");
        }
        location.reload();
      },
      error: function(e) {
        var res = e.responseText;
        alert(res);
      }
    });
  }
};
