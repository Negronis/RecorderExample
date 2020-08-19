const fs = require('fs');
const crypto = require('crypto');
function writeFs(name, data) {
   console.log('开始缓存文件 ....');
   fs.writeFile(name, data, function (err) {
      if (err) {
         console.log('缓存文件失败 ....');
         return
      } else {
         console.log('缓存文件成功')
      }
   });
}
function readFs(name, encode = 'utf8', cb) {
   fs.readFile(name, encode, function (err, data) {
      if (err) {
         console.log('读取文件出错 ...' + err, typeof err);
         if (err['code'] === 'ENOENT') {
            console.log('未发现该文件 ....');
            cb(false);
         }
      } else {
         cb(true, data);
      }
   })
}
// sha1加密
function sha1(str) {
   let shasum = crypto.createHash('sha1');
   shasum.update(str);
   str = shasum.digest('hex');
   return str;
}
//签名时间戳
function createTimestamp() {
   return parseInt(new Date().getTime() / 1000) + "";
}
//签名随机字符串
function createNonceStr() {
   return Math.random().toString(36).substr(2, 15);
}
function raw(args) {
   var keys = Object.keys(args)
   keys = keys.sort()
   var newArgs = {}
   keys.forEach(function (key) {
      newArgs[key.toLowerCase()] = args[key]
   })

   var string = ''
   for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k]
   }
   string = string.substr(1)
   return string
}
module.exports = {
   writeFs, readFs,sha1 , createTimestamp , createNonceStr ,  raw 
}