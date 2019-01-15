
const shareContent = (req,res)=>{
    const text = '猪年大吉，金猪送福，免费抽签送黄金100g，立即领取！' ;
    res.send(text);
}


const shareImage = (req,res)=>{
    const url = 'htp:ssss' ;
    res.send(url);
}

module.exports = {
    shareContent,
    shareImage
}
