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
  loadGoodList();
})();

//加载商品列表
function loadGoodList() {
  $.ajax({
    type: 'get',
    url: 'php/usergoods.php',
    dataType: 'json',
    data: {
      uid: uid,
      page: page
    },
    success: function(res) {
      var goodListArr = res.goodListInfo;
      var username = res.username;
      var goodList = document.querySelector('#goodList');
      innerHTML = "";

      for (var i = 0; i < goodListArr.length; i++) {
        //type
        innerType = '';
        for (var j = 0; j < goodListArr[i].gtype.length; j++) {
          innerType += "  " + goodListArr[i].gtype[j];
        }
        innerHTML +=
          "    <a href=\"detail.html?gid=" + goodListArr[i].gid + "\" class=\"list-group-item\">" +
          "        <div class=\"media\">" +
          "          <div class=\"media-left media-middle\">" +
          "            <img src=\"img/" + goodListArr[i].gname + "/2x.jpg\" class=\"media-object \">" +
          "          </div>" +
          "          <div class=\"media-body\">" +
          "            <h4 class=\"media-heading\">" + goodListArr[i].gname + "</h4>" +
          "            <p>" + innerType + "</p>" +
          "            <p class=\"text-right\">" + goodListArr[i].btime + "</p>" +
          "          </div>" +
          "        </div>" +
          "      </a>";
      }
      goodList.innerHTML = innerHTML;

      var person = document.querySelector('#person');
      person.innerHTML =
        "<a href=\"person?uid="+uid+"\">" +
        " <h4>"+username+"</h4>" +
        "</a>";

      var review = document.querySelector('#review');
      review.innerHTML =
      "<a href=\"reviews.html?uid="+uid+"\">评测</a>"


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
    loadGoodList();
  });
  $(".next").click(function() {
    if (page < maxpage) {
      page++;
    }
    loadGoodList();
  });
});
