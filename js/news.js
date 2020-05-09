var page = 1;
var maxpage = 1;

(function init() {
  loadNewsList();
})();

//加载商品列表
function loadNewsList() {
  $.ajax({
    type: 'get',
    url: 'php/news.php',
    dataType: 'json',
    data: {
      type: 1,
      page: page
    },
    success: function(res) {
      var newsInfoArr = res.newsListInfo;
      var nums = res.nums;
      maxpage = res.maxPage;

      //公告列表
      var newslist = document.querySelector('#newslist');
      var innerHTML = '';
      for (var i = 0; i < newsInfoArr.length; i++) {
        var innerDelete;
        var cookieObj = getCookieObj();
        if (cookieObj.username == undefined) {
          innerDelete = '';
        } else {
          if (cookieObj.grantp == 1) {
            innerDelete = "		<a href=\"javascript:void(0);\" onclick=del(" + newsInfoArr[i].id + ") title=\"删除\">" +
              "              <span class=\"glyphicon glyphicon-trash\"></span>" +
              "        </a>";
          } else {
            innerDelete = '';
          }
        }
        innerHTML +=
          "<li class=\"list-group-item\">" +
          "    <h4 class=\"list-group-item-heading\"><a href=\"newsdetail?nid=" + newsInfoArr[i].id + "\">" + newsInfoArr[i].title + "</a></h4>" +
          "    <p class=\"list-group-item-text text-right\">" +
          newsInfoArr[i].time + innerDelete +
          "	 </p>" +
          "  </li>";

      }
      newslist.innerHTML = innerHTML;

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
    loadNewsList();
  });
  $(".next").click(function() {
    if (page < maxpage) {
      page++;
    }
    loadNewsList();
  });
});

//删除公告
function del(nid) {
  $.ajax({
    type: 'get',
    url: 'php/news.php',
    dataType: 'json',
    data: {
      nid: nid,
      type: 2
    },
    success: function(res) {
      alert("删除成功");
      loadNewsList();
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
};


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
