var item = '';
var page = 1;
var type = 1;
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
  if (getQueryVariable('item')) {
    item = decodeURI(getQueryVariable('item')).trim();
  } else {
    item = '%';
  }
  //直接进入页面后，自动发送ajax请求，等待数据回传之后直接加载到页面之上
  $.ajax({
    type: 'get',
    url: 'php/type.php',
    dataType: 'json',
    data: {
      item: item,
      page: page,
      type: type
    },
    success: function(res) {
      //抬头初始化
      if (item != '%') {
        var pageheader = document.querySelector('#pageheader');
        pageheader.innerHTML =
          "<h1>正在浏览" + item + "类型的游戏 <br> <small>浏览商城上最新、最热销的" + item + "产品</small>";
      } else {
        var pageheader = document.querySelector('#pageheader');
        pageheader.innerHTML =
          "<h1>正在浏览所有类型的游戏 <br> <small>浏览商城上最新、最热销的产品</small>";
      }

      //轮播图初始化
      var carouselInfoArr = res.carouselInfo;
      var gsum = res.goodsum;
      var innerHTML = '';
      if (gsum >= 1) {
        innerHTML =
          "<div class=\"item active\">" +
          "            <img src=\"img/" + carouselInfoArr[0].gimg + "/header.jpg\" class=\"img-responsive img-rounded center-block col-md-7\">" +
          "            <div class=\"col-md-5 hidden-xs hidden-sm\">" +
          "              <div class=\"row\">" +
          "                <a href=\"detail?gid=" + carouselInfoArr[0].gid + "\">" +
          "                <h2>" + carouselInfoArr[0].gname + "</h2>" +
          "                </a>" +
          "              </div>" +
          "              <div class=\"row\">" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[0].gimg + "/1.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[0].gimg + "/2.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "              </div>" +
          "              <br>" +
          "              <div class=\"row\">" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[0].gimg + "/3.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[0].gimg + "/4.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "              </div>" +
          "              <div class=\"row\">" +
          "                <h3>￥" + Math.ceil(carouselInfoArr[0].gprice * carouselInfoArr[0].discount) + "&nbsp;&nbsp;&nbsp;<del><small>￥" + carouselInfoArr[0].gprice + "</small></del>" + "</h3>" +
          "              </div>" +
          "            </div>" +
          "          </div>";
      };
      if (gsum >= 2) {
        innerHTML +=
          "          <div class=\"item\">" +
          "            <img src=\"img/" + carouselInfoArr[1].gimg + "/header.jpg\" class=\"img-responsive center-block img-rounded col-md-7\">" +
          "            <div class=\"col-md-5 hidden-xs hidden-sm\">" +
          "              <div class=\"row\">" +
          "                <a href=\"detail?gid=" + carouselInfoArr[1].gid + "\">" +
          "                <h2>" + carouselInfoArr[1].gname + "</h2>" +
          "                </a>" +
          "              </div>" +
          "              <div class=\"row\">" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[1].gimg + "/1.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[1].gimg + "/2.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "              </div>" +
          "              <br>" +
          "              <div class=\"row\">" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[1].gimg + "/3.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[1].gimg + "/4.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "              </div>" +
          "              <div class=\"row\">" +
          "                <h3>￥" + Math.ceil(carouselInfoArr[1].gprice * carouselInfoArr[1].discount) + "&nbsp;&nbsp;&nbsp;<del><small>￥" + carouselInfoArr[1].gprice + "</small></del>" + "</h3>" +
          "              </div>" +
          "            </div>" +
          "          </div>";
      };
      if (gsum >= 3) {
        innerHTML +=
          "          <div class=\"item\">" +
          "            <img src=\"img/" + carouselInfoArr[2].gimg + "/header.jpg\" class=\"img-responsive center-block img-rounded col-md-7\">" +
          "            <div class=\"col-md-5 hidden-xs hidden-sm\">" +
          "              <div class=\"row\">" +
          "                <a href=\"detail?gid=" + carouselInfoArr[2].gid + "\">" +
          "                <h2>" + carouselInfoArr[2].gname + "</h2>" +
          "                </a>" +
          "              </div>" +
          "              <div class=\"row\">" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[2].gimg + "/1.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[2].gimg + "/2.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "              </div>" +
          "              <br>" +
          "              <div class=\"row\">" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[2].gimg + "/3.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[2].gimg + "/4.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "              </div>" +
          "              <div class=\"row\">" +
          "                <h3>￥" + Math.ceil(carouselInfoArr[2].gprice * carouselInfoArr[2].discount) + "&nbsp;&nbsp;&nbsp;<del><small>￥" + carouselInfoArr[2].gprice + "</small></del>" + "</h3>" +
          "              </div>" +
          "            </div>" +
          "          </div>";
      };

      var carouselItem = document.querySelector('#carousel-inner');
      carouselItem.innerHTML = innerHTML;

      innerHTML = '';
      if (gsum >= 1) {
        innerHTML =
          "<li data-target=\"#carousel-example-generic\" data-slide-to=\"0\" class=\"active\"></li>";
      };
      if (gsum >= 2) {
        innerHTML +=
          "<li data-target=\"#carousel-example-generic\" data-slide-to=\"1\"></li>";
      };
      if (gsum >= 3) {
        innerHTML +=
          "<li data-target=\"#carousel-example-generic\" data-slide-to=\"2\"></li>";
      }
      var carouselIndicators =
        document.querySelector('.carousel-indicators');
      carouselIndicators.innerHTML = innerHTML;


      //商品列表初始化
      var goodInfoArr = res.goodListInfo;
      var innerHTML = '';
      var innerType = '';
      for (var i = 0; i < goodInfoArr.length; i++) {
        // 判断打折
        var discount='';
        if (goodInfoArr[i].discount != 1) {
          discount = "<del><small>￥" + goodInfoArr[i].gprice + "</small></del>" +
            "&nbsp;&nbsp;&nbsp;";
        }
        // type
        innerType = '';
        for (var j = 0; j < goodInfoArr[i].gtype.length; j++) {
          innerType += "  " + goodInfoArr[i].gtype[j];
        }
        innerHTML +=
          "<a href=\"detail?gid=" + goodInfoArr[i].gid + "\" class=\"list-group-item\">" +
          "        <div class=\"media\">" +
          "          <div class=\"media-left media-middle\">" +
          "            <img src=\"img/" + goodInfoArr[i].gimg + "/2x.jpg\" class=\"media-object \">" +
          "          </div>" +
          "          <div class=\"media-body\">" +
          "            <h4 class=\"media-heading\">" + goodInfoArr[i].gname + "</h4>" +
          "            <p>" + innerType + "</p>" +
          "            <p class=\"text-right\">"+discount+"&nbsp;&nbsp;&nbsp;￥" + Math.ceil(goodInfoArr[i].gprice * goodInfoArr[i].discount) + "</p>" +
          "          </div>" +
          "        </div>" +
          "      </a>";
      }
      var goodList = document.querySelector('#goodListInfo');
      goodList.innerHTML = innerHTML;

      //商品页数初始化
      maxpage = res.maxPage;

      var pageNum = document.querySelector('#pageNum');
      pageNum.innerHTML = "--第" + page + "/" + maxpage + "页--"
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
})();
// 重新加载商品列表
function loadGoodList() {
  $.ajax({
    type: 'get',
    url: 'php/type.php',
    dataType: 'json',
    data: {
      page: page,
      type: type,
      item: item
    },
    success: function(res) {
      //商品列表重新加载
      var goodInfoArr = res.goodListInfo;
      var innerHTML = '';
      var innerType = '';
      for (var i = 0; i < goodInfoArr.length; i++) {
        // 判断打折
        var discount='';
        if (goodInfoArr[i].discount != 1) {
          discount = "<del><small>￥" + goodInfoArr[i].gprice + "</small></del>" +
            "&nbsp;&nbsp;&nbsp;";
        }
        // type
        innerType = '';
        for (var j = 0; j < goodInfoArr[i].gtype.length; j++) {
          innerType += "  " + goodInfoArr[i].gtype[j];
        }
        innerHTML +=
          "<a href=\"detail?gid=" + goodInfoArr[i].gid + "\" class=\"list-group-item\">" +
          "        <div class=\"media\">" +
          "          <div class=\"media-left media-middle\">" +
          "            <img src=\"img/" + goodInfoArr[i].gimg + "/2x.jpg\" class=\"media-object \">" +
          "          </div>" +
          "          <div class=\"media-body\">" +
          "            <h4 class=\"media-heading\">" + goodInfoArr[i].gname + "</h4>" +
          "            <p>" + innerType + "</p>" +
          "            <p class=\"text-right\">"+discount+"&nbsp;&nbsp;&nbsp;￥" + Math.ceil(goodInfoArr[i].gprice * goodInfoArr[i].discount) + "</p>" +
          "          </div>" +
          "        </div>" +
          "      </a>";
      }
      var goodList = document.querySelector('#goodListInfo');
      goodList.innerHTML = innerHTML;

      var pageNum = document.querySelector('#pageNum');
      pageNum.innerHTML = "--第" + page + "/" + maxpage + "页--"
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

$(function changeType() {
  $("#type1").click(function() {
    type = 1;
    loadGoodList();
  });
  $("#type2").click(function() {
    type = 2;
    loadGoodList();
  });
});
