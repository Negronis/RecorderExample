
//手撸一个ajax
var ajax = function (url, data, True, False) {
   var xhr = new XMLHttpRequest();
   xhr.timeout = 20000;
   xhr.open("POST", url);
   xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
         if (xhr.status == 200) {
            var o = JSON.parse(xhr.responseText);
            console.log(o);
            if (o.c) {
               False(o.m);
               return;
            };
            True(o);
         } else {
            False("请求失败[" + xhr.status + "]");
         }
      }
   };
   var arr = [];
   for (var k in data) {
      arr.push(k + "=" + encodeURIComponent(data[k]));
   };
   xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
   xhr.send(arr.join("&"));
};
import wx from 'weixin-js-sdk';
ajax("https://fepic.natapp4.cc/api/getSign",
   {
      action: "sign", 
      url: encodeURIComponent(location.href.replace(/#.*/g, ""))
   },
   function (data) {
      console.log(data);
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
         console.error("到这了wx.config", res);
         console.log(res.errMsg);
      });
      wx.ready(function () {
         console.log("微信JsSDK签名配置完成");
      });
   }
) 