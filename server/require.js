const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const {getSign , getAudio} = require('./wechat'); 
// 创建application/json 解析器
var jsonParser = bodyParser.json()
// 微信接口
router.post('/getSign', jsonParser, (req, res) => {
   console.log('收到请求 ....');
   let { url, action ,  mediaID} = req['body']; 
   if (action && action == 'sign') {
      getSign(url, res);
   } 
   if(action && action == 'wxdown'){
      getAudio(mediaID,res)
   }
})
//签名
module.exports = router;
