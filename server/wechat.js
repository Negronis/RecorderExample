const axios = require('axios');
const { writeFs, readFs, sha1, raw, createTimestamp, createNonceStr } = require('./util');
const fs = require('fs');
const Config = {
   grant_type: 'client_credential',
   appid: ' ',
   secret: ' ',
   accessUrl: "https://api.weixin.qq.com/cgi-bin/token"
};
// 获取access_token
function getAccessToken() {
   return new Promise(function (resolve, reject) {
      console.log('检查access_token中 ...');
      const reqUrl = `${Config['accessUrl']}?grant_type=${Config['grant_type']}&appid=${Config['appid']}&secret=${Config['secret']}`;
      readFs('./access_token.txt', 'utf8', function (hav, data) {
         if (hav) {
            console.log('获取到缓存中的token ....', data);
            resolve(data);
         } else {
            console.log('缓存中不存在token,发起请求 ....');
            axios.get(reqUrl).then(function (res) {
               let result = res.data.access_token;
               console.log('请求token成功，保存至缓存 ....' + res.data);
               //缓存设置
               if (result) {
                  writeFs('./access_token.txt', result);
                  console.log('token保存成功 ....' + result);
               } else {
                  let errMsg = res.data.errcode + res.data.errmsg;
                  throw Error(errMsg)
               }
               resolve(result);
            }).catch(function (err) {
               reject(err);
               console.log('token请求失败 ....' + err);
            })
         }
      })
   })
}
//获取jsapi_ticket
function getTicket() {
   return new Promise(function (resolve, reject) {
      const url = "https://api.weixin.qq.com/cgi-bin/ticket/getticket";
      readFs('./ticket.txt', 'utf8', function (hav, data) {
         if (hav) {
            console.log('查找ticket成功 ...' + data);
            resolve(data);
         } else {
            console.log('查找缓存ticket失败，准备尝试请求 ...');
            console.log('token获取中 ....');
            getAccessToken().then(function (access_token) {
               if (access_token) {
                  console.log('token获取成功，正在请求ticket ....');
                  axios.get(`${url}?access_token=${access_token}&type=jsapi`).then(function (res) {
                     console.log('请求响应成功 ....')
                     console.log(res.data);
                     let { ticket, errcode, errmsg } = res.data;
                     if (ticket) {
                        console.log('ticket获取成功，准备进行缓存...')
                        writeFs('./ticket.txt', ticket);
                        resolve(ticket);
                     } else {
                        throw Error('ticket获取失败：', errcode, errmsg);
                     }
                  }).catch(function (error) {
                     reject(error);
                  })
               }
            }).catch(function (error) {
               console.log(' 获取失败 ....', error)
            })
         }
      })
   })
}
// 签名
function getSign(param, res) {
   console.log('尝试获取签名 ....')
   getTicket().then(function (ticket) {
      console.log('获取ticket成功 .... ')
      var ret = {
         jsapi_ticket: ticket,
         nonceStr: createNonceStr(),
         timestamp: createTimestamp(),
         url: decodeURIComponent(param)
      }
      console.log(param, ret);
      var string = raw(ret);
      ret.signature = sha1(string);
      ret.appid = Config.appid;
      console.log('ret', ret);
      console.log('转码成功 ....');
      res.json({
         appid: ret['appid'],
         timestamp: ret['timestamp'],
         debug: true,
         nonceStr: ret['nonceStr'],
         signature: ret['signature'],
         jsApiList: [
            'startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice'
         ]
      })
   }).catch(function (error) {
      throw Error(error);
   })
}
// 清除token
function clearTokenATicket(fn,args){
   console.log('清除已缓存token和ticket');
   let access_token = "access_token.txt";
   let ticket = "ticket.txt";
   fs.unlinkSync(access_token);
   fs.unlinkSync(ticket); 
   fn.apply(this, ...args);
} 
// 获取音频临时素材
function getAudio(param, res) { 
   console.log('尝试获取微信端临时素材 ....' , param);
   let url = "https://api.weixin.qq.com/cgi-bin/media/get";
   let media_id = param; 
   if (!media_id) {
      res.send('获取音频id失败，请检查 ....')
   }
   console.log('获取到了音频,正在请求 ....')
   getAccessToken().then(access_token => {
      axios.get(
         url + `?access_token=${access_token}&media_id=${media_id}`,{
            responseType:'arraybuffer'
         }
      ).then(response => {   
         let {  errcode, errmsg } = response['data']; 
         if (errcode) {
            console.log('token疑似过期' + errcode , errmsg); 
            clearTokenATicket(getAudio , [media_id , res]);
            return;
         } else {  
            let type = response['headers']['content-type'] ;  
            let duration = 0;  
            let data = response['data']; 
            // arm存储
            console.log('正在存储amr临时音频文件 ...');
            var fileName = sha1( createTimestamp() + Math.random());
            fs.writeFile("./voice/" + fileName + ".amr", data, (err)=>{
               if(err){
                  console.log('音频文件获取失败 ...');
                  return ; 
               }
               console.log('存储临时文件成功，正在转换为base64 ...')
               let data = fs.readFileSync('./voice/'+fileName+'.amr' , 'base64'); 
               // buffer转化为base64编码
               let bufferData = data.toString('base64'); 
               res.json(
                  { 
                     mime:type,
                     data:bufferData,
                     duration:duration
                  }
               ); 
            });  
         }
      })
   })
}
module.exports = {getSign,getAudio};