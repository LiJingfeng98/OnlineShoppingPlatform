// 搜索功能
$(function searchItem() {
  $("#search").click(function() {
    var string = $("#searchItem").val();
    var url = "search.html?item="+string;
      window.location.href=url;
  });
  // 无效
  // $("#searchItem").keydown(function(e) {
  //       if (e.keyCode == 13) {
  //         var string = $("#searchItem").val();
  //         var url = "search.html?item="+string;
  //         window.location.href=url;
  //       }
  //  });
});
