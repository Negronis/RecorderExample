/********先加载RecordApp需要用到的支持文件*********/

//必须引入的app核心文件，换成require也是一样的。注意：app.js会自动往window下挂载名称为RecordApp对象，全局可调用window.RecordApp，也许可自行调整相关源码清除全局污染
import RecordApp from 'recorder-core/src/app-support/app'
//可选开启Native支持，需要引入此文件
import 'recorder-core/src/app-support/app-native-support'
//可选开启IOS上微信录音支持，需要引入此文件
import 'recorder-core/src/app-support/app-ios-weixin-support'

//这里放置可选的独立配置文件，提供这些文件时可免去修改app.js源码。这些配置文件需要自己编写，参考https://github.com/xiangyuecn/Recorder/tree/master/app-support-sample 目录内的这两个测试用的配置文件代码。
//import '你的配置文件目录/native-config.js' //可选开启native支持的相关配置
import './ios-weixin-config';
//import '你的配置文件目录/ios-weixin-config.js' //可选开启ios weixin支持的相关配置
/*********然后加载Recorder需要的文件***********/
//必须引入的核心。所有文件都需要自行引入，否则app.js会尝试用script来请求需要的这些文件，进而导致错误，引入后会检测到组件已自动加载，就不会去请求了
import 'recorder-core'

//需要使用到的音频格式编码引擎的js文件统统加载进来
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/engine/wav'

//由于大部分情况下ios-weixin的支持需要用到amr解码器，应当把amr引擎也加载进来
import 'recorder-core/src/engine/beta-amr'
import 'recorder-core/src/engine/beta-amr-engine'

//可选的扩展支持项
import 'recorder-core/src/extensions/waveview';
export default RecordApp;