/**
 * 小程序配置文件
 */
const QQMapWX = require('/utils/qqmap-wx-jssdk.min.js');
var QQgetLocation = new QQMapWX({
  key: 'NBRBZ-DIVCP-AD6DM-VR64N-AELBJ-IBBIB' // 必填
});
// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la
var host = "";
const cid = '8a9a488566624d8301667556664e0001';

var config = {

  // 下面的地址配合云端 Server 工作
  host,
  cid,
  //base login
  baseUrl: `https://${host}/`,

  // 登录地址，用于建立会话
  loginUrl: `https://${host}/no_auth/wx/getSession`,

  //发送用户信息到服务端
  initUserUrl: `https://${host}/no_auth/wx/init/userinfo`,

  //APPid
  wxAppId: '',

  //本地缓存前缀
  cachePrefix: 'xtep_',

  key:'NBRBZ-DIVCP-AD6DM-VR64N-AELBJ-IBBIB',

  //app名称
  appName: 'xrun-PaaS',

  //image合法域名
  imageUrl: 'https://xtepactive.image.alimmdn.com'
};

module.exports = {
  config,
  QQgetLocation
}