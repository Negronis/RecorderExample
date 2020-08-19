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