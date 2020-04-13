var uid;
var uname;
var page = 1;
var maxpage = 1;


(function init() {
  // 获取cookie 登录状态
  cookieObj = getCookieObj();
  if (cookieObj.username == undefined) {
    alert("请先登录后再访问该页面！");
    window.location.href = 'index.html';
    return;
  } else {
    uid = cookieObj.userid;
    uname = decodeURI(cookieObj.username);
  }
  //直接进入页面后，自动发送ajax请求，等待数据回传之后直接加载到页面之
  loadOrderList();
})();

//加载评论列表
function loadOrderList() {
  $.ajax({
    type: 'get',
    url: 'php/order.php',
    dataType: 'json',
    data: {
      type: 1,
      uid: uid,
      page: page
    },
    success: function(res) {
      var orderListArr = res.orderListInfo;
      var orderList = document.querySelector('#accordion');
      innerHTML = "";
      // orderList循环
      for (var i = 0; i < orderListArr.length; i++) {
        var innerDetail = '';
        // orderDetail循环
        for (var j = 0; j < orderListArr[i].orderDetail.length; j++) {
          // goodType判断 1可退款，0不可,2为已退款
          var innerDelete = '';
          if (orderListArr[i].orderDetail[j].type == 1) {
            innerDelete = "<a href=\"javascript:void(0);\" onclick=\"del(\'" + uid + " \',\'" + orderListArr[i].orderDetail[j].gid + "\')\" title=\"退款\">申请退款：<span class=\"glyphicon glyphicon-remove-circle\"></span> </a>";
          } else if (orderListArr[i].orderDetail[j].type == 0) {
            innerDelete = "不可退款：" +
              "<span class=\"glyphicon glyphicon-remove-circle\"></span>";
          } else if (orderListArr[i].orderDetail[j].type == 2) {
            innerDelete = "已退款：" +
              "<span class=\"glyphicon glyphicon-remove-circle\"></span>";
          }
          innerDetail +=
            "            <div class=\"media\">" +
            "              <div class=\"media-left media-top\">" +
            "                <img src=\"img/" + orderListArr[i].orderDetail[j].gimg + "/2x.jpg\" class=\"media-object\">" +
            "              </div>" +
            "              <div class=\"media-body\">" +
            "                <h4 class=\"media-heading\">" + orderListArr[i].orderDetail[j].gname + "</h4>" +
            "                <p class=\"text-right\">￥" + orderListArr[i].orderDetail[j].price + "</p>" +
            "                <p class=\"text-right\">" + innerDelete +
            "                </p>" +
            "              </div>" +
            "            </div>" +
            "            <hr>";
        }


        innerHTML +=
          "      <div class=\"panel panel-success\">" +
          "        <div class=\"panel-heading\">" +
          "          <h4 class=\"panel-title\">" +
          "            <a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#collapse" + orderListArr[i].oid + "\">" +
          "              <strong>时间：" + orderListArr[i].time + "&nbsp&nbsp总额：" + orderListArr[i].amount + "￥</strong>" +
          "            </a>" +
          "          </h4>" +
          "        </div>" +
          "        <div id=\"collapse" + orderListArr[i].oid + "\" class=\"panel-collapse collapse\">" +
          "          <div class=\"panel-body\">" + innerDetail +
          "          </div>" +
          "        </div>" +
          "      </div>";
      }
      orderList.innerHTML = innerHTML;

      var pageNum = document.querySelector('#pageNum');
      pageNum.innerHTML = "--第" + page + "/" + maxpage + "页--";

    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};

// 前后页切换
$(function changePage() {
  $(".previous").click(function() {
    if (page > 1) {
      page--;
    }
    loadOrderList();
  });
  $(".next").click(function() {
    if (page < maxpage) {
      page++;
    }
    loadOrderList();
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

//退款
function del(uid, gid) {
  $.ajax({
    type: 'get',
    url: 'php/order.php',
    dataType: 'json',
    data: {
      type: 2,
      uid: uid,
      gid: gid
    },
    success: function(res) {
      switch (res.infoCode) {
        case 1:
          alert("退款成功！");
          break;
        case 2:
          alert("已超过退款期！");
          break;
        case 0:
          alert("未知错误！");
          break;
        default:
      }
      loadOrderList();
      location.reload();
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
}
