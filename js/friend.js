var uid = 1;
var page = 1;
var maxpage = 1;

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
  // 判断是否登录
  cookieObj = getCookieObj();
  if (cookieObj.username == undefined) {
    alert("请先登录后再访问该页面！");
    window.location.href = 'index.html';
    return;
  } else {
    uid = cookieObj.userid;
    uname = decodeURI(cookieObj.username);
  }
  $("#aboutText").html(uname + " 的好友关注");
  //直接进入页面后，自动发送ajax请求，等待数据回传之后直接加载到页面之
  loadFriendList();
})();

//加载好友列表
function loadFriendList() {
  $.ajax({
    type: 'get',
    url: 'php/friend.php',
    dataType: 'json',
    data: {
      uid: uid,
      page: page,
      type: 1
    },
    success: function(res) {
      var friendListArr = res.friendListInfo;
      var friendList = document.querySelector('#friendList');
      innerHTML = "";
      for (var i = 0; i < friendListArr.length; i++) {
        innerHTML +=
          "    <div class=\"col-sm-4 col-xs-6 col-md-3\">" +
          "        <div class=\"thumbnail\">" +
          "            <img src=\"img/headimg/" + friendListArr[i].fimg + ".jpg\">" +
          "            <div class=\"caption\">" +
          "                <h3 class=\"text-center\">" + friendListArr[i].fname + "</h3>" +
          "                <p>" +
          "                    <a href=\"person.html?uid=" + friendListArr[i].fid + "\" class=\"btn btn-primary \" role=\"button\">" +
          "                        访问主页" +
          "                    </a>" +
          "                    <a href=\"javascript:void(0);\" onclick=\"del(" + friendListArr[i].fid + ")\" title=\"取消关注\" class=\"btn btn-default pull-right\" role=\"button\">" +
          "                        取消关注" +
          "                    </a>" +
          "                </p>" +
          "            </div>" +
          "        </div>" +
          "    </div>";
      }
      friendList.innerHTML = innerHTML;

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
    loadFriendList();
  });
  $(".next").click(function() {
    if (page < maxpage) {
      page++;
    }
    loadFriendList();
  });
});

//取消关注
function del(fid) {
  $.ajax({
    type: 'get',
    url: 'php/friend.php',
    dataType: 'json',
    data: {
      fid: fid,
      uid: uid,
      type: 2
    },
    success: function(res) {
      if(res.infoCode){
        alert("删除成功");
      }
      else{
        alert("删除失败");
      }
      loadFriendList();
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};
