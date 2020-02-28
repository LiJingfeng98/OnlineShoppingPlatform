var page = 1;
var maxpage = 1;

(function init() {
    loadGoodList();
})();

//加载商品列表
function loadGoodList(){
  $.ajax({
    type: 'get',
    url: 'php/rank.php',
    dataType: 'json',
    data: {
      page: page
    },
    success: function(res) {
      var goodInfoArr = res.goodListInfo;
      var gnums = res.gnums;
      maxpage = res.maxPage;

      //商品列表
      var goodList = document.querySelector('#goodlist');
      var innerHTML = '';
      for (var i = 0; i < goodInfoArr.length; i++) {
        innerType = '';
        for (var j = 0; j < goodInfoArr[i].gtype.length; j++) {
          innerType += "  " + goodInfoArr[i].gtype[j];
        }
        innerHTML +=
          "<a href=\"detail?gid=" + goodInfoArr[i].gid + "\" class=\"list-group-item\">" +
          "        <div class=\"media\">" +
          "          <div class=\"media-left media-middle\">" +
          "            <img src=\"img/" + goodInfoArr[i].gname + "/2x.jpg\" class=\"media-object \">" +
          "          </div>" +
          "          <div class=\"media-body\">" +
          "            <h4 class=\"media-heading\">" + goodInfoArr[i].gname + "</h4>" +
          "            <p>" + innerType + "</p>" +
          "            <p class=\"text-right\">" + goodInfoArr[i].gsum + "份</p>" +
          "          </div>" +
          "        </div>" +
          "      </a>";
      }
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
