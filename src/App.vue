<template>
  <div id="app">
    <button @click="startR">开始录音</button>
    <br>
    <button @click="endR">结束录音</button>
    <br>
    测试音频：
    <audio :src="activeBlob" control v-if="activeBlob"></audio>
    音频的blob文件：{{activeBlob || '暂无'}}
  </div>
</template> 

<script>
export default {
  data() {
    return {
      rec: "",
      activeBlob: "",
    };
  },
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
  },
  methods: {
    startR() {
          this.$RecordApp.Start(
            { 
              type: "mp3",
              sampleRate: 16000,
              bitRate: 16,  
              onProcess: function ( buffers,  powerLevel,  bufferDuration,    bufferSampleRate,  newBufferIdx,  asyncEnd  ) {
                console.log(
                  buffers, powerLevel,  bufferDuration,   bufferSampleRate, newBufferIdx, asyncEnd
                ); 
              },
            }, 
            function(){
              console.log('开始录音 ....');
            },
            function (msg) {
              console.log("开始录音失败：" + msg);
            }
          ); 
    },
    endR(){ 
      let that = this;
        this.$RecordApp.Stop(
          function (blob, duration) {
            //到达指定条件停止录音和清理资源
            console.log(
              blob,  (window.URL || window.webkitURL).createObjectURL(blob),
              "时长:" + duration + "ms"
            ); 
            that.activeBlob = blob;
            //已经拿到blob文件对象想干嘛就干嘛：立即播放、上传
          },
          function (msg) {
            console.log("录音失败:" + msg);
          }
        );
    }
  }, 
};
</script>

<style>
.vc-switch {
  bottom: 400px !important;
}
</style> 
