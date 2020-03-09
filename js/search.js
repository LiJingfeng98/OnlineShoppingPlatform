var item = '';
var type = 1; //销量排序1，最新排序2，价格降序3，价格升序4
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
  //获取item,type参数（get方法）
  if (getQueryVariable('item')) {
    item = decodeURI(getQueryVariable('item')).trim();
  };
  if (getQueryVariable('type')) {
    type = decodeURI(getQueryVariable('type')).trim();
  };

  // 设置type列表组
  var typeTop = document.querySelector('#typeTop');
  var typeTopText = "销量排序";
  switch (type) {
    case '1':
      typeTopText = "销量排序";
      break;
    case '2':
      typeTopText = "最新排序";
      break;
    case '3':
      typeTopText = "价格降序";
      break;
    case '4':
      typeTopText = "价格升序";
      break;
    default:
      break;
  }
  typeTop.innerHTML = typeTopText + "<span class=\"caret\"></span>";

  var typeList = document.querySelector('#typeList');
  typeList.innerHTML =
    "<li><a href=\"search.html?item=" + item + "&type=1\">销量排序</a></li>" +
    "<li role=\"separator\" class=\"divider\"></li>" +
    "<li><a href=\"search.html?item=" + item + "&type=2\">最新排序</a></li>" +
    "<li role=\"separator\" class=\"divider\"></li>" +
    "<li><a href=\"search.html?item=" + item + "&type=3\">价格降序</a></li>" +
    "<li role=\"separator\" class=\"divider\"></li>" +
    "<li><a href=\"search.html?item=" + item + "&type=4\">价格升序</a></li>";

    loadGoodList();
})();

//加载商品列表
function loadGoodList(){
  $.ajax({
    type: 'get',
    url: 'php/search.php',
    dataType: 'json',
    data: {
      item: item,
      type: type,
      page: page
    },
    success: function(res) {
      var goodInfoArr = res.goodListInfo;
      var gnums = res.gnums;
      maxpage = res.maxPage;
      // 查询个数
      var goodnums = document.querySelector('#gnums');
      goodnums.innerHTML = gnums + " 个匹配的搜索结果。";
      // 查询内容
      var searchText = document.querySelector('#searchText');
      var text = '所有产品';
      if (item != '') {
        text = item;
      }
      searchText.innerHTML = text;

      //商品列表
      var goodList = document.querySelector('#goodlist');
      var innerHTML = '';
      for (var i = 0; i < goodInfoArr.length; i++) {
        // 判断打折
        var discount='';
        if (goodInfoArr[i].discount != 1) {
          discount = "<del><small>￥" + goodInfoArr[i].gprice + "</small></del>" +
            "&nbsp;&nbsp;&nbsp;";
        }
        // 录入类别
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
