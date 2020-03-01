var page = 1;
var maxpage = 1;

(function init() {
    loadNewsList();
})();

//加载商品列表
function loadNewsList(){
  $.ajax({
    type: 'get',
    url: 'php/news.php',
    dataType: 'json',
    data: {
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
        innerHTML +=
          "<a href=\"newsdetail?nid=" + newsInfoArr[i].id + "\" class=\"list-group-item\">" +
          "        <div class=\"media\">" +
          "          <div class=\"media-body\">" +
          "            <h4 class=\"media-heading\">" + newsInfoArr[i].title + "</h4>" +
          "            <p class=\"text-right\">" + newsInfoArr[i].time + "</p>" +
          "          </div>" +
          "        </div>" +
          "      </a>";
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
    loadGoodList();
  });
  $(".next").click(function() {
    if (page < maxpage) {
      page++;
    }
    loadGoodList();
  });
});
