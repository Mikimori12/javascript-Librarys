/*==============================================================================
  ■MJLibs00Main：メインクラス
================================================================================*/
var MJLibs00Main = (function() {

  //■【メンバ変数】
  var _Main, _Methods, _Button, _Parts, _Config, _Common, _TTT, _Loading;

  //■【コンストラクタ】
  var MJLibs00Main = function() {
    _Main = this;
  };
  var PT = MJLibs00Main.prototype;

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【メソッド】
  PT.MainStart = function() {
  console.log('■main start')

    //▼ローディングアニメーションライブラリ
    //var loading = new MJLibsLoadingAnimation();
    
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【return】
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  return MJLibs00Main;
})();

/*==============================================================================
//■【起動】
================================================================================*/
window.addEventListener("DOMContentLoaded", function() {
  var main = new MJLibs00Main();
  main.MainStart();
}, false);
