var page = 1;
var maxpage = 1;
var uid = 1;
var visitUid;
var visitName;
var cookieObj;
var hasLogin = false;
(function init() {
  //获取gid参数（get方法）
  if (getQueryVariable('uid')) {
    uid = getQueryVariable('uid');
  }
  // 获取cookie 登录状态
  cookieObj = getCookieObj();
  if (cookieObj.username == undefined) {
    hasLogin = false;
  } else {
    visitUid = cookieObj.userid;
    visitName = decodeURI(cookieObj.username);
    hasLogin = true;
  }

  //直接进入页面后，自动发送ajax请求，等待数据回传之后直接加载到页面之上
  //type 1.初始化  2.留言列表  3.提交留言
  $.ajax({
    type: 'get',
    url: 'php/person.php',
    dataType: 'json',
    data: {
      uid: uid,
      type: 1
    },
    success: function(res) {
      var userInfo = res.userInfo;
      var recentBuy = res.recentBuy;
      var recentComment = res.recentComment;
      document.querySelector('body').style['background-image'] =
        "url('img/bg/" + userInfo.bgimg + "')";

      document.querySelector('#uheadimg').setAttribute("src", "img/headimg/" + userInfo.uimg + ".jpg");

      document.querySelector('#uname').innerHTML =
        "<strong >" + userInfo.uname + "</strong>";

      document.querySelector('#introduce').innerHTML = userInfo.introduce;

      var innerHTML;
      // 是否登录
      if(hasLogin){
        // 自我访问
        if(visitUid == uid){
          innerHTML = "<li><a href=\"editUser.html\">编辑资料</a></li>";
        }
        // 管理员访问
        else if(cookieObj.grantp==1){
          innerHTML = "<li><a href=\"#\" data-toggle=\"modal\" data-target=\"#myModal\">封禁发言</a></li>"
        }
        // 他人访问
        else{
          innerHTML = "<li><a href=\"javascript:void(0);\" onclick=\"add()\">添加关注</a></li>";
        }

      }
      // 未登录
      else{
        innerHTML ='';
      }

      document.querySelector('#ubtnGroup').innerHTML =
        "<a class=\"btn btn-primary btn-lg\" type=\"button\" href=\"usergoods.html?uid=" + uid + "\">库存 <span class=\"badge\">" + userInfo.wsum + "</span>" +
        "              </a>" +
        "<a class=\"btn btn-primary btn-lg\" type=\"button\" href=\"reviews.html?uid=" + uid + "\">评测 <span class=\"badge\">" + userInfo.csum + "</span>" +
        "              </a>" +
        "              <button type=\"button\" class=\"btn btn-primary dropdown-toggle btn-lg\" data-toggle=\"dropdown\" aria-expanded=\"false\">" +
        "                更多" +
        "                <span class=\"caret\"></span>" +
        "              </button>" +
        "              <ul class=\"dropdown-menu\">" +innerHTML +
        "              </ul>";
      // 最近购买
      if (recentBuy.infoCode == 1) {
        typeString = "";
        for (var j = 0; j < recentBuy.gtype.length; j++) {
          typeString += "  " + recentBuy.gtype[j];
        }
        document.querySelector('#recentBuyBody').innerHTML =
          "        <a href=\"detail.html?gid=" + recentBuy.gid + "\" class=\"list-group-item\">" +
          "          <div class=\"media\">" +
          "            <div class=\"media-left media-middle\">" +
          "              <img src=\"img/" + recentBuy.gname + "/2x.jpg\" class=\"media-object \">" +
          "            </div>" +
          "            <div class=\"media-body\">" +
          "              <h4 class=\"media-heading\">" + recentBuy.gname + "</h4>" +
          "              <p>" + typeString + "</p>" +
          "              <p class=\"text-right\">" + recentBuy.time + "</p>" +
          "            </div>" +
          "          </div>" +
          "        </a>";
      } else {
        $('#recentBuyPanel').css('display', 'none');
      }
      // 最近评论
      if (recentComment.infoCode == 1) {
        var recentCommentBody = document.querySelector("#recentCommentBody");
        var typeString = "";
        var alertString = "";
        var imgString = "";
        if (recentComment.type == 1) {
          typestring = "好评";
          alertString = "alert-success";
          imgString = "glyphicon-thumbs-up";
        } else {
          typestring = "差评";
          alertString = "alert-danger";
          imgString = "glyphicon-thumbs-down";
        }
        recentCommentBody.innerHTML =
          "        <div class=\"media\">" +
          "          <div class=\"media-left\">" +
          "            <a href=\"detail.html?gid=" + recentComment.gid + "\">" +
          "              <img class=\"media-object center-block\" src=\"img/" + recentComment.gname + "/2x.jpg\" alt=\"...\">" +
          "            </a>" +
          "          </div>" +
          "          <div class=\"media-body\">" +
          "            <div class=\"alert " + alertString + "\" style=\"font-size:15px;  font-weight: 700\" role=\"alert\">" +
          "              <span class=\"glyphicon " + imgString + "\"></span>" + typestring +
          "            </div>" +
          "          </div>" +
          "        </div>" +
          "        <div class=\"well\">" +
          "          <p>" + recentComment.comment + "</p>" +
          "        </div>";
      } else {
        $('#recentCommentPanel').css('display', 'none');
      }
      // 留言输入
      if (!visitUid) {
        $('#writeMessage').css('display', 'none');
      }
      else{
        document.querySelector("#visitName").innerHTML = visitName;
        var state = checkState();
        if(state){
          $('#messageText').attr('disabled','disabled');
          $('#messageText').val('您已被封禁，请与管理员联系');
          $('#submessage').attr('class','btn btn-danger');
          $('#submessage').attr('disabled','disabled');
        }
        else{
          $(document).on("click", "#submessage", writeMessage);
        }
      }

    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
  loadMessage();
})();

//加载评论列表
function loadMessage() {
  $.ajax({
    type: 'get',
    url: 'php/person.php',
    dataType: 'json',
    data: {
      uid: uid,
      page: page,
      type: 2
    },
    success: function(res) {
      maxpage = res.maxPage;
      var messageArr = res.messageList;
      var messageList = document.querySelector("#messageList");
      var innerHTML = "";
      var innerDelete = "";
      for (var i = 0; i < messageArr.length; i++) {
        if(visitUid == messageArr[i].uid ||
          visitUid == uid || cookieObj.grantp==1){
          innerDelete =
          "<div class=\"text-right\">" +
          " <a href=\"javascript:void(0);\" onclick=\"del(" + messageArr[i].mid + ")\" title=\"删除\">" +
          "<span class=\"glyphicon glyphicon-trash\"></span>" +
          "   </a>" +
          "</div>" ;
        }
        else{
          innerDelete = '';
        }
        innerHTML +=
          "         <hr>" +
          "        <div class=\"media\">" +
          "          <div class=\"media-left media-top\">" +
          "            <a href=\"person.html?uid=" + messageArr[i].uid + "\">" +
          "              <img class=\"media-object\" src=\"img/headimg/" + messageArr[i].uimg + "_s.jpg\">" +
          "            </a>" +
          "          </div>" +
          "          <div class=\"media-body\">" +
          "            <h4 class=\"media-heading\">" + messageArr[i].uname + " &nbsp&nbsp&nbsp" +
          "              <small>" + messageArr[i].time + "</small>" +
          "            </h4>" + messageArr[i].message +
          "          </div>" +innerDelete+
          "        </div>";

      }
      messageList.innerHTML = innerHTML;

      var pageNum = document.querySelector('#pageNum');
      pageNum.innerHTML = "--第" + page + "/" + maxpage + "页--";
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};

// 写入留言
function writeMessage() {
  var message = $("#messageText").val();
  $.ajax({
    type: 'get',
    url: 'php/person.php',
    dataType: 'json',
    data: {
      sender: visitUid,
      receiver: uid,
      message: message,
      type: 3
    },
    success: function(res) {
      alert("留言成功");
      $('#messageText').val('');
      loadMessage();
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};

//删除留言
function del(mid){
  $.ajax({
    type: 'get',
    url: 'php/person.php',
    dataType: 'json',
    data: {
      mid: mid,
      type: 4
    },
    success: function(res) {
      alert("删除成功")
      loadMessage();
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};

//添加关注
function add(){
  $.ajax({
    type: 'get',
    url: 'php/person.php',
    dataType: 'json',
    data: {
      uid:visitUid,
      fid:uid,
      type: 5
    },
    success: function(res) {
      if(res.infoCode){
        alert("关注成功");
      }
      else{
        alert("您已关注");
      }
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};

// 新增封禁
$(function addState() {
  $("#addState").click(function() {
    var date = $("#inputDate").val();
    $.ajax({
      type: 'get',
      url: 'php/person.php',
      dataType: 'json',
      data: {
        date: date,
        uid: uid,
        type: 6
      },
      success: function(res) {
        if (res.infoCode) {
          alert("封禁成功！");

        } else {
          alert("封禁失败！");
        }
        $('#myModal').modal('hide');
        location.reload();
      },
      error: function(e) {
        var res = e.responseText;
        alert(res);
      }
    });
  });
});

// 是否被封禁
function checkState(){
  var flag;
  $.ajax({
    type: 'get',
    url: 'php/person.php',
    dataType: 'json',
    async:false,
    data: {
      uid: visitUid,
      type: 7
    },
    success: function(res) {
      if(res.infoCode){
        flag=true;
      }
      else{
        flag=false;
      }
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
  return flag;
};

// 前后页切换
$(function changePage() {
  $(".previous").click(function() {
    if (page > 1) {
      page--;
    }
    loadMessage();
  });
  $(".next").click(function() {
    if (page < maxpage) {
      page++;
    }
    loadMessage();
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
