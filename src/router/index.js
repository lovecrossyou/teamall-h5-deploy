var express = require('express');

var router = express.Router();
var controller = require('../controller');

router.get('/', function (req, res) {
    res.render('index')
});
// 生成二维码
router.get('/create_qrcode', controller.qrcode.create_qrcode);
router.get('/createShareImg', controller.qrcode.createShareImg);
//获取七牛baseUrl
router.post('/qiniuBaseUrl', controller.qiniu.baseUrl);

// 分享相关
router.get('/shareImage', controller.shareInfo.shareImage);
router.post('/shareContent', controller.shareInfo.shareContent);

module.exports = router ;
