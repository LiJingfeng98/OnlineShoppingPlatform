var uid = 1;
var page = 1;
var maxpage = 1;
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

(function init() {
  //获取gid参数（get方法）
  if (getQueryVariable('uid')) {
    uid = getQueryVariable('uid');
  }
  //直接进入页面后，自动发送ajax请求，等待数据回传之后直接加载到页面之
  loadCommentList();
})();

//加载评论列表
function loadCommentList() {
  $.ajax({
    type: 'get',
    url: 'php/reviews.php',
    dataType: 'json',
    data: {
      uid: uid,
      page: page
    },
    success: function(res) {
      console.log(res);
      var commentListArr = res.commentListInfo;
      var username = res.username;
      var commentList = document.querySelector('#commentList');

      var typeString = "";
      var alertString = "";
      var imgString = "";
      innerHTML = "";
      for (var i = 0; i < commentListArr.length; i++) {
        if (commentListArr[i].type == 1) {
          typestring = "好评";
          alertString = "alert-success";
          imgString = "glyphicon-thumbs-up";
        } else {
          typestring = "差评";
          alertString = "alert-danger";
          imgString = "glyphicon-thumbs-down";
        }
        innerHTML +=
          "        <div class=\"panel panel-default\">" +
          "          <div class=\"panel-body\">" +
          "            <div class=\"media\">" +
          "              <div class=\"media-left\">" +
          "                <a href=\"detail.html?gid=" + commentListArr[i].gid + "\">" +
          "                  <img class=\"media-object center-block\" src=\"img/" + commentListArr[i].gname + "/2x.jpg\" alt=\"...\">" +
          "                </a>" +
          "              </div>" +
          "              <div class=\"media-body\">" +
          "                <div class=\"alert " + alertString + "\" style=\"font-size:15px;  font-weight: 700\" role=\"alert\">" +
          "                  <span class=\"glyphicon " + imgString + "\"></span>" + typestring +
          "                </div>" +
          "              </div>" +
          "            </div>" +
          "            <!-- 评论 -->" +
          "            <div class=\"well\">" +
          "              <p>" + commentListArr[i].comment + "</p>" +
          "            </div>" +
          "            <p class=\"text-right\">发表于：" + commentListArr[i].time + "</p>" +
          "          </div>" +
          "        </div>";
      }
      commentList.innerHTML = innerHTML;

      var person = document.querySelector('#person');
      person.innerHTML =
        "<a href=\"person?uid=" + uid + "\">" +
        " <h4>" + username + "</h4>" +
        "</a>";

      var warehouse = document.querySelector('#warehouse');
      warehouse.innerHTML =
        "<a href=\"usergoods.html?uid=" + uid + "\">库存</a>";

      var warehouse1 = document.querySelector('#warehouse1');
      warehouse1.innerHTML =
        "<a href=\"usergoods.html?uid=" + uid + "\">库存</a>";


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
    loadCommentList();
  });
  $(".next").click(function() {
    if (page < maxpage) {
      page++;
    }
    loadCommentList();
  });
});
