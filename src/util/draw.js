const { createCanvas,Image,loadImage,registerFont } = require('canvas')
const BASE64  = require('./base64')
const queryString = require('querystring') ;


const width_canvas = 670;
const height_canvas = 940;
var desHeight = 100;

registerFont(__dirname + '/PINGFANG.TTF', {family: '苹方'});

const startDraw = async (req,res) => {

    const {userName,logo,inviteId,discountGameId,des,download} = req.query ;

    let qrTextPretty = 'https://www.xiteng.com/xitenggamenode/create_qrcode?text=https://www.xiteng.com/xitenggamejar/index?discountGameId='+discountGameId+'&inviteId='+inviteId
    if(download!==undefined){
        qrTextPretty = 'https://www.xiteng.com/xitenggamenode/create_qrcode?text=https://www.xiteng.com/xitenggamenode/%23/buyingspree/page' ;
    }
    const avatarLogo = logo ;

    // 创建画布
    const canvas = createCanvas(width_canvas, height_canvas);
    const ctx = canvas.getContext('2d')
    await DrawImage(ctx,__dirname + '/../assets/share/bg_photo_yaoqing1.png',{x:0,y:0,w:width_canvas,h:height_canvas})
    drawRoundRect(ctx, (width_canvas-596)/2, 56, 596, 810, 10);

    if(userName){
        let nameStr = BASE64.decode(userName).replace(/\ +/g,"").replace(/[\r\n]/g,"");
        drawName(ctx, nameStr||'');
    }
    let desStr = '猪年大吉，金猪送福，免费抽签送黄金100g，立即领取！'
    // if (des){
    //    let desObj =  queryString.parse(des);
    //    let desString = Object.keys(desObj)[0] ;
    //     // 去除空格  和 回车换行
    //     desStr = desString.replace(/\ +/g,"").replace(/[\r\n]/g,"");
    // }
    drawDes(ctx, desStr, 0);
    await DrawImage(ctx,__dirname + '/../assets/share/fenxiang_xiaocehngxu.jpg',{x:(width_canvas-504)/2,y:190+desHeight+30,w:504,h:416})
    drawcodeDes(ctx, '新年运势来袭，黄金100g属于你！', 0);
    drawcodeDes(ctx, '长按识别小程序，立即加入抢购', 1);
    if(qrTextPretty){
        await drawQR(ctx,qrTextPretty||'');
    }
    await drawZeroImg(ctx, '');
    if(avatarLogo){
        await drawAvatar(ctx,avatarLogo);
    }
    await drawAvatar(ctx, avatarLogo);

    const stream = canvas.createPNGStream()
    res.writeHead(200, {'Content-Type': 'image/png','Accept-Charset':'utf-8'});
    stream.pipe(res)
}
const DrawImage = async (ctx,path,react)=>{
    const myimg = await loadImage(path);
    ctx.drawImage(myimg, react.x, react.y, react.w, react.h);
}
const drawAvatar = async (ctx, icon) => {
    // await loadImage(path);
    const icon_xt = __dirname + '/../assets/logo_xiteng.png'
    const myimg = await loadImage(icon_xt);
    ctx.beginPath();
    ctx.arc(width_canvas / 2, 65, 35, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(myimg, width_canvas / 2 - 35, 30, 70, 70);
    ctx.restore()
}

const drawName = (ctx, name) => {
    ctx.beginPath();
    var text = name;
    //字体大小,类型
    ctx.fillStyle = "#333333";
    // ctx.textAlign='center'
    ctx.font = '24px "苹方"';
    ctx.fillText(text, (width_canvas - ctx.measureText(text).width) / 2, 140);
}

const drawDes = (ctx, des, index) => {
    ctx.beginPath();
    ctx.fillStyle = "#333333";
    ctx.font = "26px 苹方";
    ctx.lineWidth=1;
    var str = des
    var lineWidth = 0;
    var canvasWidth = 450;//计算canvas的宽度
    var initHeight=0;//绘制字体距离canvas顶部初始的高度
    var lastSubStrIndex= 0; //每次开始截取的字符串的索引
    if (str.length>50){
        str = str.substr(0,50)
    }
    for(let i=0;i<str.length;i++){

        lineWidth+=ctx.measureText(str[i]).width;
        if(lineWidth>canvasWidth){
            ctx.fillText(str.substring(lastSubStrIndex,i),110,initHeight+190);//绘制截取部分
            initHeight+=35;//20为字体的高度
            lineWidth=0;
            lastSubStrIndex=i;
        }
        if(i==str.length-1){//绘制剩余部分
            ctx.fillText(str.substring(lastSubStrIndex,i+1),100,initHeight+190);
            console.log(initHeight)
        }
        desHeight = initHeight;

    }

}
const drawcodeDes = (ctx, des, index) => {
    ctx.beginPath();
    var text = des;
    //字体大小,类型
    ctx.fillStyle = "#e6454a";
    ctx.font = "24px 苹方";
    ctx.fillText(text, (width_canvas - 480) / 2, 770 + 28 * index)
}
const drawQR = async (ctx, qrText) => {
    await DrawImage(ctx,qrText,{x:460,y:715,w:125,h:125})
    await DrawImage(ctx,__dirname + '/../assets/share/logo_fenxiang_qianggou.png',{x:460+(125-35)/2,y:715+(125-35)/2,w:35,h:35})
}

const drawZeroImg = async (ctx, jinli) => {
    await DrawImage(ctx,__dirname + '/../assets/share/logo_fenxiang_qianggou1.png',{x:(width_canvas - 155) / 2,y:890,w:155,h:35})
}
const drawRoundRect =(cxt, x, y, width, height, radius)=>{

    cxt.beginPath();
    cxt.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 3 / 2);
    cxt.lineTo(width - radius + x, y);
    cxt.arc(width - radius + x, radius + y, radius, Math.PI * 3 / 2, Math.PI * 2);
    cxt.lineTo(width + x, height + y - radius);
    cxt.arc(width - radius + x, height - radius + y, radius, 0, Math.PI * 1 / 2);
    cxt.lineTo(radius + x, height +y);
    cxt.arc(radius + x, height - radius + y, radius, Math.PI * 1 / 2, Math.PI);
    cxt.closePath();
    cxt.fillStyle = "#fff";
    cxt.fill();


}
 module.exports= {
    startDraw
 }

