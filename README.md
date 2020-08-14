###### 该项目需要注意：

1. 要在main.js中引入wav.js
2. 要修改ios-weixin-config.js中的window.RecordAppBaseFolder为当前文件路径
3. recorder.js的引入顺序
4. 修改ios-weixin-config.js中的MyWxApi为请求后台微信签名的api

###### RecorderApp的使用说明：

	1. 在main.js中，全局挂载$RecordApp以便调用

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

