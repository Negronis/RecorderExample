##### node实现获取微信签名

###### 安装

```javascript
npm install
```

###### 运行

```javascript
node app.js
```

注意：

1. 修改appid,appSecret
2. 如果没有内置项目删除默认打开index.html代码
3. amr音频存储文件夹是voice，请自行创建
4. 安装了amr转mp3文件代码在下面，mp3文件夹请自行创建
5. 回调函数按照Recorder.js库定义，到时自行修改

###### 转Mp3

```javascript
const amrToMp3 = require('amrToMp3');
amrToMp3('./voice/'+fileName + ".amr",'./mp3/').then(src=>{
                  console.log('转换amr为MP3成功 ...' + src); 
                  let data = fs.readFileSync(src);
                  // buffer转化为base64编码
                  let bufferData = new Buffer.from(data).toString('base64');
     	          //做些什么
               }).catch(err=>{
                  console.log('转换amr为MP3失败 ...' +err);
               })
```

###### 前端直接使用的base64:

```javascript
const mimeType = require('mime-type'); 
let base64 = "data:" + mineType.lookup(src) + ';base64,' + bufferData; 
```

