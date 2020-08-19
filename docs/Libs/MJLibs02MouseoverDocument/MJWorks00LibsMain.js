/*==============================================================================
  ■MJWorks00LibsMain：メインクラス
================================================================================*/
var MJWorks00LibsMain = (function() {

  //■【メンバ変数】
  var _Main, _Libs;

  //■【コンストラクタ】
  var MJWorks00LibsMain = function() {
    _Main = this;
  };
  var PT = MJWorks00LibsMain.prototype;

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■メイン
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【メソッド】
  PT.RunLibsMain = function() {
  console.log(' ▼Libs Main')
    //▼
    _Libs = new MJLibs02MouseoverDocument({});
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【return】
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  return MJWorks00LibsMain;
})();