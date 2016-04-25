#!/usr/bin/env node

var program = require('commander');
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');

var stdin=process.stdin;
var eles = [];

program
  .version('0.0.1')
  .command('<name>', {isDefault: true})
  .action(function (name) {
    var gb = iconv.encode(name, 'gb2312');

    var encodedstr = [''];
    for (var i = 0; i < gb.length; i++) {
      encodedstr.push(gb[i].toString(16).toUpperCase());
    }
    var enurl = encodedstr.join('%');
    console.log('name %s', name, enurl);

    request.post({
      url:'http://www.meijutt.com/search.asp',
      encoding: null,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      form: 'searchword=' + enurl
    }, function(err,httpResponse,body){
      if (err) throw err;
      var gbk_body = iconv.decode(body, 'GBK');
      var $ = cheerio.load(gbk_body);

      $('a.font_16').each(function () {
        var url = $(this).attr('href');
        var title = $(this).attr('title');
        eles.push([title, 'http://www.meijutt.com' + url]);
      })

      console.log('搜索到 %d 条结果', eles.length);

      for (var i = 0; i < eles.length; i++) {
        console.log('[ %d ]: %s', i, eles[i].join('\t'));
      }
      console.log('请输入关联的数字进行下载:');
      stdin.resume()
    });
  });

  stdin.on('data', function (data) {
    if (!eles.length || !data) {
      return;
    };

    var number = +data.toString();
    var ele = eles[number];

    console.log('开始下载: 《%s》\n', ele[0]);

    request({
      url: ele[1],
      encoding: null
    }, function (err, resp, body) {
      if (err) throw err;
      var gbk_body = iconv.decode(body, 'GBK');

      var re = /var GvodUrls[0-9]{1} = (.*?)\;echoDown/igm;
      var matchs_str = [];
      var matchs;
      while (matchs = re.exec(gbk_body)) {
        matchs_str.push(matchs[1]);
      }

      if (!matchs_str.length) {
        console.log('没有可用资源提供下载，可能该剧还未上映:');
        return;
      }

      var hd_str = matchs_str[matchs_str.length - 1];
      var title_url = hd_str.split('$down');

      var download_link = title_url.map(function (link) {
        var _reg = /第[0-9]+集\$(.*)/igm;
        var mc = _reg.exec(link);
        return mc ? mc[1] : '';
      });

      console.log(download_link.join('\n'));
      console.log('下载成功，请拷贝以上连接至您的下载工具进行下载。');
      process.exit(0);
    });
  });

program.parse(process.argv);
