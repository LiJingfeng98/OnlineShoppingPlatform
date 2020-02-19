//构建自已的ajax框架，
//1约定1:参数模仿jq的格式， 也是一个json
//    json中必要字段有:
//    type请求类型、 url请求地址、 data请求参数、 success请求回调

function myAjax(paramsObj) {
  if (paramsObj.type.toLowerCase() == 'get') {
    var arr = [];
    for (var pro in paramsObj.data) {
      var str = pro + '=' + paramsObj.data[pro];
      arr.push(str);
    }
    var canshuStr = arr.join('&');
    //拼接到ur1后面
    paramsObj.url += paramsObj.url.indexOf('?') == -1 ?
      '?' + canshuStr :
      '&' + canshuStr;

    console.log(paramsObj.url);
  } else if (paramsObj.type.toLowerCase() == 'post') {
    console.log('这是post请求');
  } else {
    console.log('请求类型错误');
  }
}
