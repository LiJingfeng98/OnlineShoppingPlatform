// 搜索功能
$(function searchItem() {
  $("#search").click(function() {
    var string = $("#searchItem").val();
    var url = "search.html?item=" + string;
    window.location.href = url;
  });
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

// 注销功能
$(document).on("click", "#logout", function logOut() {
  $.ajax({
    type: 'get',
    url: 'php/header.php',
    dataType: 'json',
    success: function(res) {
      location.reload();
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  })
});



(function init() {
  var cookieObj = getCookieObj();

  if (typeof(cookieObj.username) != "undefined") {
    cookieObj.username = decodeURI(cookieObj.username);
    var loginName = document.querySelector("#LoginName");
    loginName.innerHTML =
      "<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">" +
      cookieObj.username +
      "<b class=\"caret\"></b>" +
      " </a>" +
      "<ul class=\"dropdown-menu\">" +
      "<li><a href=\"person.html?uid=" + cookieObj.userid + "\">个人资料</a></li>" +
      "<li class=\"divider\"></li>" +
      "<li><a href=\"friend.html\">好友</a></li>" +
      "<li class=\"divider\"></li>" +
      "<li><a href=\"cart.html\">购物车</a></li>" +
      "<li class=\"divider\"></li>" +
      "<li><a href=\"usergoods.html?uid=" + cookieObj.userid + "\">库存</a></li>" +
      " </ul>";

    var balance = document.querySelector("#balance");
    balance.innerHTML =
      "<a href=\"recharge.html\">￥" + cookieObj.balance + "</a>";

    var stateBox = document.querySelector("#stateBox");
    stateBox.innerHTML =
      "<a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">" +
      "  <img src=\"img/headimg/"+cookieObj.userimg+"_s.jpg\" class=\"img-rounded img-responsive\">" +
      "</a>" +
      "<ul class=\"dropdown-menu\">" +
      "   <li id=\"logout\"><a href=\"#\" >注销</a></li>" +
      "    <li class=\"divider\"></li>" +
      "    <li><a href=\"#\">帐户明细</a></li>" +
      " </ul>";
  }
})();
