###### 插件库地址为：https://github.com/xiangyuecn/Recorder/tree/master/app-support-sample

###### 该项目需要注意：

2. 要修改ios-weixin-config.js中的window.RecordAppBaseFolder为当前文件路径
3. recorder.js的引入顺序
4. 修改ios-weixin-config.js中的MyWxApi为请求后台微信签名的api

***

###### recorder在Vue中的引入顺序为：

<Font color="red">Recorder.js：</Font>

```javascript
/********先加载RecordApp需要用到的支持文件*********/
import RecordApp from 'recorder-core/src/app-support/app'
import 'recorder-core/src/app-support/app-native-support'
import 'recorder-core/src/app-support/app-ios-weixin-support'
import './ios-weixin-config';
import 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/engine/beta-amr'
import 'recorder-core/src/engine/beta-amr-engine'
import 'recorder-core/src/engine/wav'
import 'recorder-core/src/extensions/waveview';
export default RecordApp;
```

<Font color="red">main.js：</Font>

```javascript
import RecordApp from './recorder'; 
Vue.use(RecordApp);
Vue.prototype.$RecordApp = RecordApp;
```

***

###### ios-weixin-config.js中需要修改的配置：

```javascript
// ||后面改为ios-config.js所在位置
window.RecordAppBaseFolder = window.PageSet_RecordAppBaseFolder || "/src/";
// ||后面修改为请求后台的地址
var MyWxApi = window.PageSet_RecordAppWxApi || "";
// 获取微信签名函数 - 最底下函数修改
 var config = function (data) {
     //注意参数key值一定不要出问题，否则签名可能会失败
     wx.config({
         debug: false
         , appId: data.appid
         , timestamp: data.timestamp
         , nonceStr: data.nonceStr
         , signature: data.signature
         , jsApiList: ("getLocation"
                       + ",startRecord,stopRecord,onVoiceRecordEnd"
                       + ",playVoice,pauseVoice,stopVoice,onVoicePlayEnd"
                       + ",uploadVoice,downloadVoice"
                      ).split(",")
     });
     wx.error(function (res) {
         end(res.errMsg);
     });
     wx.ready(function () {
         console.log("微信JsSDK签名配置完成");
         end();
     });
};
// 签名请求
ajax(MyWxApi, {
    action: "sign"
    , url: encodeURIComponent(location.href.replace(/#.*/g, ""))
}, function (data) { 
    // 签名成功
    config(data);
}, end);
// 下载临时素材的请求 - 按需修改
config.DownWxMedia = function (param, success, fail) { 
    //参数按实际情况修改
    ajax(MyWxApi, {
        action: "wxdown"
        ,mediaID: param.mediaId
    }, function (data) {
        // 下载回调 - 按实际情况修改
        success(data);
    }, function (msg) {
        fail("下载音频失败：" + msg);
    });
}
```

<Font color="red">注意了，签名失败一定要检查api地址/签名地址/当前访问地址是否都相同，而且微信安全域名配置不要加http|https://前缀</Font>

***

###### RecorderApp的使用说明：

	1. 在main.js中，全局挂载$RecordApp以便调用

###### 行为简介：

开始录音：

```javascript
this.$RecordApp.Start({
    type:"mp3",
    sampleRate:16000,
    bitRate:16,
    //事实回调
    onProcess:function(buffers,  powerLevel,  bufferDuration,    bufferSampleRate,  newBufferIdx,  asyncEnd){
         console.log(
                  buffers, powerLevel,  bufferDuration,   bufferSampleRate, newBufferIdx, asyncEnd
                );
                //如果当前环境支持实时回调（that.$RecordApp.Current.CanProcess()），收到录音数据时就会实时调用本回调方法
                //可利用extensions/waveview.js扩展实时绘制波形
                //可利用extensions/sonic.js扩展实时变速变调，此扩展计算量巨大，onProcess需要返回true开启异步模式
    },
    //开始成功回调
    function(){
        console.log('开始录音 ...')
    },
    //开始失败回调
    function(msg){
        console.log('开始失败了 ...',msg)
    }
})
```

结束录音：

```javascript
this.$RecordApp.Stop(
    //拿到录音的blob文件和时长
    function(blob,duration){
        //创建可以播放的blob链接
        let fileBlob =  (window.URL || window.webkitURL).createObjectURL(blob);
    },
    //录音失败回调
    function(msg){
        console.log('录音失败')
    }
)
```

在生命周期中注册统一接口：

```javascript
mounted(){
    this.$RecordApp.RequestPermission(
        // 用户已经授权的回调
        function () {
          console.log('嗯 用户授权了 ...')
        },
        //用户拒绝未授权或不支持
        function (msg, isUserNotAllow) { 
          console.log(
            (isUserNotAllow ? "UserNotAllow，" : "") + "无法录音:" + msg
          );
        }
      )
}
```

目前在IOS和Android微信都能正常使用，后台文件在server文件夹内。

***

后台部分

##### node实现获取微信签名 + 录音 配合Recorder.js

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

