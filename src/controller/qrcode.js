const qr = require('qr-image')
var QRCode = require('qrcode')
const { Image ,createCanvas} = require('canvas')
const path = require('path')
const fs = require('fs')
const {startDraw} = require('../util/draw')


// 生成二维码
exports.create_qrcode = function (req, res) {
    const params = req.query;

    let dark = '#e6454aff' ;
    let light = '#ffffffff' ;
    let dark_light_color = req.query.color ;
    if(dark_light_color!==undefined){
        dark = '#'+dark_light_color.split('_')[0] ;
        light = '#'+dark_light_color.split('_')[1] ;
    }
    let text = '';
    console.log('params--------'+Object.keys(params));
    Object.keys(params).forEach(function (key) {


        if (text === '') {
            text = params[key];
        }
        else if(key==='color'){

        }
        else {
            text += '&' + key + '=' + params[key];
        }
    })
    try {

        QRCode.toDataURL(text, { errorCorrectionLevel: 'H' ,scale:1, width:200, color: {
                dark: dark,  // dots color
                light: light // Transparent background
            }},function (err, url) {
            const img = new Image()
            img.onload = () =>{



                const canvas = createCanvas(200, 200);
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0)

                const stream = canvas.createPNGStream()
                stream.pipe(res)
            }
            img.onerror = err => { throw err }
            img.src = url;

            // console.log('thj+======',url)
            // var img = qr.image(text, {size: 10});


        })

    } catch (e) {
        res.writeHead(414, {'Content-Type': 'text/html'});
        res.end('<h1>414 Request-URI Too Large</h1>');
    }
}

// 生成整张分享图
exports.createShareImg = function (req, res) {
    startDraw(req,res)
}


