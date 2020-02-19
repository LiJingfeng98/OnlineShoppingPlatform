;
(function() {
  //直接进入页面后，自动发送ajax请求，等待数据回传之后直接加载到页面之上
  $.ajax({
    type: 'get',
    url: 'php/index.php',
    dataType: 'json',
    success: function(res) {
      var carouselInfoArr = res.carouselInfo;
      var innerHTML =
        "<div class=\"item active\">" +
        "            <img src=\"img/" + carouselInfoArr[0].gname + "/header.jpg\" class=\"img-responsive img-rounded col-md-7\">" +
          "            <div class=\"col-md-5 hidden-xs hidden-sm\">" +
          "              <div class=\"row\">" +
          "                <a href=\"detail?gid=" + carouselInfoArr[0].gid + "\">" +
          "                <h2>" + carouselInfoArr[0].gname + "</h2>" +
          "                </a>" +
          "              </div>" +
          "              <div class=\"row\">" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[0].gname + "/1.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[0].gname + "/2.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "              </div>" +
          "              <br>" +
          "              <div class=\"row\">" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[0].gname + "/3.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[0].gname + "/4.jpg\" class=\"img-rounded img-responsive\"></div>" +
          "              </div>" +
          "              <div class=\"row\">" +
          "                <h3>$" + carouselInfoArr[0].gprice + "</h3>" +
          "              </div>" +
          "            </div>" +
          "          </div>" +
          "          <div class=\"item\">" +
          "            <img src=\"img/" + carouselInfoArr[1].gname + "/header.jpg\" class=\"img-responsive img-rounded col-md-7\">" +
            "            <div class=\"col-md-5 hidden-xs hidden-sm\">" +
            "              <div class=\"row\">" +
            "                <a href=\"detail?gid=" + carouselInfoArr[1].gid + "\">" +
            "                <h2>" + carouselInfoArr[1].gname + "</h2>" +
            "                </a>" +
            "              </div>" +
            "              <div class=\"row\">" +
            "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[1].gname + "/1.jpg\" class=\"img-rounded img-responsive\"></div>" +
            "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[1].gname + "/2.jpg\" class=\"img-rounded img-responsive\"></div>" +
            "              </div>" +
            "              <br>" +
            "              <div class=\"row\">" +
            "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[1].gname + "/3.jpg\" class=\"img-rounded img-responsive\"></div>" +
            "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[1].gname + "/4.jpg\" class=\"img-rounded img-responsive\"></div>" +
            "              </div>" +
            "              <div class=\"row\">" +
            "                <h3>$" + carouselInfoArr[1].gprice + "</h3>" +
            "              </div>" +
            "            </div>" +
            "          </div>" +
          "          <div class=\"item\">" +
          "            <img src=\"img/" + carouselInfoArr[2].gname + "/header.jpg\" class=\"img-responsive img-rounded col-md-7\">" +
            "            <div class=\"col-md-5 hidden-xs hidden-sm\">" +
            "              <div class=\"row\">" +
            "                <a href=\"detail?gid=" + carouselInfoArr[2].gid + "\">" +
            "                <h2>" + carouselInfoArr[2].gname + "</h2>" +
            "                </a>" +
            "              </div>" +
            "              <div class=\"row\">" +
            "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[2].gname + "/1.jpg\" class=\"img-rounded img-responsive\"></div>" +
            "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[2].gname + "/2.jpg\" class=\"img-rounded img-responsive\"></div>" +
            "              </div>" +
            "              <br>" +
            "              <div class=\"row\">" +
            "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[2].gname + "/3.jpg\" class=\"img-rounded img-responsive\"></div>" +
            "                <div class=\"col-md-6\"><img src=\"img/" + carouselInfoArr[2].gname + "/4.jpg\" class=\"img-rounded img-responsive\"></div>" +
            "              </div>" +
            "              <div class=\"row\">" +
            "                <h3>$" + carouselInfoArr[2].gprice + "</h3>" +
            "              </div>" +
            "            </div>" +
            "          </div>" ;

        var carouselItem = document.querySelector('#carousel-inner');
        carouselItem.innerHTML = innerHTML;
    },
    error: function(e) {
      var res = e.responseText;
      alert(res);
    }
  });
})();
