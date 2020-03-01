var nid = 1;
(function init() {
  if (getQueryVariable('nid')) {
    nid = getQueryVariable('nid');
  }
    loadNews();
})();

//加载商品列表
function loadNews(){
  $.ajax({
    type: 'get',
    url: 'php/newsdetail.php',
    dataType: 'json',
    data: {
      nid:nid
    },
    success: function(res) {
      if (res.infoCode == 1) {
        var newsInfo = res.newsInfo;
        innerHTML = newsInfo.title+"<small id=\"time\" class =\"pull-right\">"+newsInfo.time+"</small>"
        $('#title').html(innerHTML);
        $('#detail').html(newsInfo.detail);
      }
      else {
        alert("该公告不存在");
        window.location.href = 'index.html';
        return;
      }
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
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
