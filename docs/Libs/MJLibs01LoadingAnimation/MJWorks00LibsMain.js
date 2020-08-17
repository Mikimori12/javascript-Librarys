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
  //■ボタン応答
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //▼共通：停止
  PT.AnimeStop = function(param) {
    _Libs.Stop();
  };
  //▼回転ボール
  PT.CirclingBallStart = function(param) {
    _Libs.Start("CirclingBall");
  };
  //▼ダブルサークル
  PT.DoubleCircleStart = function(param) {
    _Libs.Start("DoubleCircle");
  };
  //▼ダブルサークルウェーブ
  PT.DoubleCircleWaveStart = function(param) {
    _Libs.Start("DoubleCircleWave");
  };
  //▼回転ボール分散
  PT.CirclingBallsWaveStart = function(param) {
    _Libs.Start("CirclingBallsWave");
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■メイン
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【メソッド】
  PT.RunLibsMain = function() {
  console.log(' ▼Libs Main')
    //▼
    _Libs = new MJLibs01LoadingAnimation({});
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【return】
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  return MJWorks00LibsMain;
})();
