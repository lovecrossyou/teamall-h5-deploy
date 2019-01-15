var express = require('express');
var compression = require('compression');
// Create our Express application
var app = express();
var proxys = require('./src/proxy/proxys')
var http = require('http');
var routers = require('./src/router')

app.use(compression());
app.disable('x-powered-by');
var ejs = require('ejs');  //我是新引入的ejs插件
app.set('views', './views'); // 指定视图所在的位置
//
app.engine('html', ejs.__express);
app.set('view engine', 'html');
app.use('/xitenggamenode', express.static(__dirname + "/views/"));
app.use('/xitenggamejar', proxys);
app.use('/xitenggamenode',routers)

var server = http.createServer(app).listen(9934, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('ranning at host', host);
    console.log('ranning at port', port);
});
