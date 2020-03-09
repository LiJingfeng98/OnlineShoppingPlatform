var gid = 1;
var page = 1;
var maxpage = 1;
var uid;
var cookieObj;
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
  if (getQueryVariable('gid')) {
    gid = getQueryVariable('gid');
  }

  //直接进入页面后，自动发送ajax请求，等待数据回传之后直接加载到页面之上
  //type 1.初始化  2.评价列表  3.提交评论
  $.ajax({
    type: 'get',
    url: 'php/detail.php',
    dataType: 'json',
    data: {
      gid: gid,
      type: 1
    },
    success: function(res) {
      var goodInfoArr = res.goodInfo;
      var goodTypeArr = res.gtypelist;
      var gctyep = res.commentType;
      maxpage = res.maxPage;
      //路径导航
      var innerHTML =
        "<li><a href=\"search.html\">所有游戏</a></li>" +
        "<li><a href=\"type?item=" + goodTypeArr[0] + "\">" + goodTypeArr[0] + "</a></li>" +
        "<li class=\"active\">" + goodInfoArr[0].gname + "</li>";
      var breadcrumb = document.querySelector('.breadcrumb');
      breadcrumb.innerHTML = innerHTML;

      //抬头部分
      var headname = document.querySelector('#goodname');
      headname.innerHTML = goodInfoArr[0].gname;

      var evaluate = '';
      switch (gctyep[0].typeCode) {
        case 1:
          evaluate = '特别好评';
          break;
        case 2:
          evaluate = '多半好评';
          break;
        case 3:
          evaluate = '褒贬不一';
          break;
        case 4:
          evaluate = '多半差评';
          break;
        case 5:
          evaluate = '暂未明确';
        default:
      }

      var refund;
      if(goodInfoArr[0].gtype==0){
        refund = "不可退款";
      }
      else{
        refund = "7天退款";
      }

      var introduce = document.querySelector('#introduce');
      introduce.innerHTML =
        "<img src=\"img/" + goodInfoArr[0].gimg + "/header.jpg\" alt=\"\" class=\"img-responsive center-block\">" +
        "        <br>" +
        "        <p class=\"text-justify\">" + goodInfoArr[0].gdetail + "</p>" +
        "        <table class=\"table table-striped\">" +
        "          <tbody>" +
        "            <tr>" +
        "              <td>全部评测</td>" +
        "              <td><a href=\"#\">" + evaluate + "</a>(" + gctyep[0].gsum + ")</td>" +
        "            </tr>" +
        "            <tr>" +
        "              <td>发行日期</td>" +
        "              <td>" + goodInfoArr[0].gdate + "</td>" +
        "            </tr>" +
        "            <tr>" +
        "              <td>发行商</td>" +
        "              <td><a href=\"\">" + goodInfoArr[0].gowner + "</a></td>" +
        "            </tr>" +
        "            <tr>" +
        "              <td>售后类别</td>" +
        "              <td>" + refund + "</td>" +
        "            </tr>" +
        "          </tbody>" +
        "        </table>";

      var carousel_inner = document.querySelector('.carousel-inner');
      carousel_inner.innerHTML =
        "<div class=\"item active\">" +
        "              <img src=\"img/" + goodInfoArr[0].gimg + "/1.jpg\" class=\"img-responsive center-block\" alt=\"First slide\">" +
        "            </div>" +
        "            <div class=\"item\">" +
        "              <img src=\"img/" + goodInfoArr[0].gimg + "/2.jpg\" class=\"img-responsive center-block\" alt=\"Second slide\">" +
        "            </div>" +
        "            <div class=\"item\">" +
        "              <img src=\"img/" + goodInfoArr[0].gimg + "/3.jpg\" class=\"img-responsive center-block\" alt=\"Third slide\">" +
        "            </div>" +
        "            <div class=\"item\">" +
        "              <img src=\"img/" + goodInfoArr[0].gimg + "/4.jpg\" class=\"img-responsive center-block\" alt=\"Third slide\">" +
        "            </div>";

      var typeList = document.querySelector('#typeList');
      innerHTML = "";
      for (var i = 0; i < goodTypeArr.length; i++) {
        innerHTML += "<a href=\"type.html?item=" + goodTypeArr[i] + "\" class=\"btn btn-primary btn-sm\">" + goodTypeArr[i] + "</a>";
      }
      innerHTML += '<a href="#" data-toggle="modal" data-target="#myModal" class="btn btn-primary btn-sm">+</a>';
      typeList.innerHTML = innerHTML;

      // 判断是否登录
      cookieObj = getCookieObj();
      var hasGoods;
      var hasComment;
      if (typeof(cookieObj.username) == "undefined") {
        hasGoods = false;
        hasComment = false;
      } else {
        uid = cookieObj.userid;
        hasGoods = checkWarehouse(uid);
        hasComment = checkComment(uid);
      }

      // 判断用户还是管理员
      var buywhat = document.querySelector('#buywhat');
      if (cookieObj.grantp == 1) {
        buywhat.innerHTML = "编辑&nbsp" + goodInfoArr[0].gname;
      } else {
        buywhat.innerHTML = "购买&nbsp" + goodInfoArr[0].gname;
      }



      // 判断是否登录
      if (typeof(cookieObj.userid) != "undefined") {
        // 判断是否为管理员
        if (cookieObj.grantp == 1) {
          innerHTML =
            "<button type=\"button\" class=\"btn btn-primary btn-lg pull-right\" id=\"incart\">编辑商品</button>";
        } else {
          //判断是否拥有
          if (hasGoods) {
            innerHTML =
              "<button type=\"button\" class=\"btn btn-primary btn-lg pull-right\" disabled=\"disabled\">已在库中</button>";
          } else {
            innerHTML =
              "<button type=\"button\" class=\"btn btn-primary btn-lg pull-right\" id=\"incart\">加入购物车</button>";
          }
        }
      }
      // 未登录
      else {
        innerHTML =
          "<button type=\"button\" class=\"btn btn-primary btn-lg pull-right\" disabled=\"disabled\">请登录后购买</button>";
      }

      // 判断是否打折
      var discount = '';
      if (goodInfoArr[0].discount != 1) {
        discount = "<del><small>￥" + goodInfoArr[0].gprice + "</small></del>" +
          "&nbsp;&nbsp;&nbsp;";
      }
      var bugPrice = document.querySelector('#bugPrice');
      bugPrice.innerHTML =
      discount +
        "￥" +
        Math.ceil(goodInfoArr[0].gprice * goodInfoArr[0].discount)  + "&nbsp;&nbsp;&nbsp;" +
        "<a href=\"#\">" + innerHTML +
        "</a>";

      // 判断是否评论
      if (hasGoods) {
        if (hasComment) {
          var writecomment = document.querySelector('#writecomment');
          writecomment.innerHTML =
            "<div class=\"alert alert-success\" role=\"alert\" ><h3><strong id=\"wcomment1\">您的库中已有《" + goodInfoArr[0].gname + "》</strong></h3></div>";
        } else {
          var wcomment1 = document.querySelector('#wcomment1');
          wcomment1.innerHTML = "您的库中已有《" + goodInfoArr[0].gname + "》";

          var wcomment2 = document.querySelector('#wcomment2');
          wcomment2.innerHTML = "为 " + goodInfoArr[0].gname + " 撰写一篇评测";

          var myimg = document.querySelector("#myimg");
          myimg.innerHTML = "<img src=\"img/headimg/" + cookieObj.userimg + ".jpg\" class=\"img-responsive center-block\">";

          if (checkState()) {
            $('textarea').attr('disabled', 'disabled');
            $('textarea').val('您已被封禁，请与管理员联系');
            $('#subcomment').attr('class', 'btn btn-danger pull-right');
            $('#subcomment').attr('disabled', 'disabled');
          }
        }
      } else {
        $('#mycomment').css('display', 'none');
      }
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
  loadCommendList();
})();

//加载评论列表
function loadCommendList() {
  $.ajax({
    type: 'get',
    url: 'php/detail.php',
    dataType: 'json',
    data: {
      gid: gid,
      page: page,
      type: 2
    },
    success: function(res) {
      var commentListArr = res.commentInfoList;
      var commentlist = document.querySelector('#commentlist');
      innerHTML = "";
      var typeString = "";
      var alertString = "";
      var imgString = "";
      for (var i = 0; i < commentListArr.length; i++) {
        if (commentListArr[i].ctyp == 1) {
          typestring = "好评";
          alertString = "alert-success";
          imgString = "glyphicon-thumbs-up";
        } else {
          typestring = "差评";
          alertString = "alert-danger";
          imgString = "glyphicon-thumbs-down";
        }
        if (typeof(cookieObj.username) == "undefined") {
          innerDelete = '';
        } else {
          if (cookieObj.userid == commentListArr[i].uid || cookieObj.grantp == 1) {
            innerDelete = " <a href=\"javascript:void(0);\" onclick=\"del(" + commentListArr[i].uid + ")\" title=\"删除\">" +
              "<span class=\"glyphicon glyphicon-trash\"></span>" +
              "   </a>";
          } else {
            innerDelete = '';
          }
        }
        innerHTML +=
          "<div class=\"panel panel-default\">" +
          "  <div class=\"panel-body\">" +
          "    <div class=\"row\">" +
          "      <div class=\"col-sm-5 col-xs-5 pull-left\" style=\"width:250px;\">" +
          "        <div class=\"col-sm-5 col-xs-5\">" +
          "          <a href=\"person.html?uid=" + commentListArr[i].uid + "\" class=\"thumbnail\">" +
          "            <img class=\"img-responsive  center-block\" src=\"img/headimg/" + commentListArr[i].uimg + ".jpg\" alt=\"\">" +
          "          </a>" +
          "        </div>" +
          "        <div class=\"col-sm-7 col-xs-7 pull-right\" style=\"color: #5aa9d6;\">" +
          "          <h4>" + commentListArr[i].uname + "</h4>" +
          "          <p class=\"small\">账户有" + commentListArr[i].ugum + "项产品<br> " + commentListArr[i].ucnum + "篇评论</p>" +
          "        </div>" +
          "      </div>" +
          "      <!-- 状态 -->" +
          "      <div class=\"alert " + alertString + " col-xs-5 col-sm-7 col-md-8 col-lg-9\" style=\"font-size:15px;  font-weight: 700\" role=\"alert\">" +
          "        <span class=\"glyphicon " + imgString + "\"></span>" + typestring + "<font class=\"pull-right\">" + commentListArr[i].ctime + innerDelete + "</font>" +
          "      </div>" +
          "    </div>" +
          "    <br>" +
          "    <div class=\"well\">" +
          "      <p>" + commentListArr[i].comment + "</p>" +
          "    </div>" +
          "  </div>" +
          "</div>";
      }
      commentlist.innerHTML = innerHTML;

      var pageNum = document.querySelector('#pageNum');
      pageNum.innerHTML = "--第" + page + "/" + maxpage + "页--";

    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};

// 写入评论
$(document).on("click", "#subcomment", function writecomment() {
  var type = $("input[name='options']:checked").val();
  var comment = $("textarea").val();
  alert(gid + uid + type + comment);
  $.ajax({
    type: 'get',
    url: 'php/detail.php',
    dataType: 'json',
    data: {
      gid: gid,
      uid: uid,
      ctype: type,
      comment: comment,
      type: 3
    },
    success: function(res) {
      location.reload();
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
});

//删除评论
function del(uid) {
  $.ajax({
    type: 'get',
    url: 'php/detail.php',
    dataType: 'json',
    data: {
      gid: gid,
      uid: uid,
      type: 4
    },
    success: function(res) {
      alert("删除成功")
      loadCommendList();
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};

// 新增类别
$(function addType() {
  $("#addType").click(function() {
    var type = $("#inputTypeName").val().trim();
    $.ajax({
      type: 'get',
      url: 'php/detail.php',
      dataType: 'json',
      data: {
        inputType: type,
        gid: gid,
        type: 5
      },
      success: function(res) {
        if (res.infoCode) {
          alert("提交成功！");

        } else {
          alert("提交失败！");
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

// 前后页切换
$(function changePage() {
  $(".previous").click(function() {
    if (page > 1) {
      page--;
    }
    loadCommendList();
  });
  $(".next").click(function() {
    if (page < maxpage) {
      page++;
    }
    loadCommendList();
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

// ------以下使用hasGoods.php-----
//查询是否拥有
function checkWarehouse(userid) {
  var flag = '';
  $.ajax({
    type: 'get',
    url: 'php/hasGoods.php',
    async: false,
    dataType: 'json',
    data: {
      gid: gid,
      uid: userid,
      type: 1
    },
    success: function(res) {
      if (res.flag == 1) {
        flag = true;
      } else {
        flag = false;
      }
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
  return flag;
}

// 是否被封禁
function checkState() {
  var flag;
  $.ajax({
    type: 'get',
    url: 'php/person.php',
    dataType: 'json',
    async: false,
    data: {
      uid: uid,
      type: 7
    },
    success: function(res) {
      if (res.infoCode) {
        flag = true;
      } else {
        flag = false;
      }
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
  return flag;
};

//查询是否评论
function checkComment(userid) {
  var flag = '';
  $.ajax({
    type: 'get',
    url: 'php/hasGoods.php',
    async: false,
    dataType: 'json',
    data: {
      gid: gid,
      uid: userid,
      type: 2
    },
    success: function(res) {
      if (res.flag == 1) {
        flag = true;
      } else {
        flag = false;
      }
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
  return flag;
}

//加入购物车
$(document).on("click", "#incart", function inCart() {
  if (cookieObj.grantp == 1) {
    window.location.href = "editGood.html?gid=" + gid;
  } else {
    $.ajax({
      type: 'get',
      url: 'php/hasGoods.php',
      dataType: 'json',
      data: {
        gid: gid,
        uid: uid,
        type: 3
      },
      success: function(res) {
        window.location.href = "cart.html";
        window.event.returnValue = false;
      },
      error: function(e) {
        var res = e.responseText;
        alert(res);
      }
    })
  }

});
