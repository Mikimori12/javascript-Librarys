/*==============================================================================
  ■MJWorks00Main：メインクラス
================================================================================*/
var MJWorks00Main = (function() {

  //■【メンバ変数】
  var _Main, _Libs;

  //■【コンストラクタ】
  var MJWorks00Main = function() {
    _Main = this;
  };
  var PT = MJWorks00Main.prototype;

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【メソッド】
  PT.MainStart = function() {
  console.log('■main start')
    //▼各ライブラリのメインjsを呼び出す
    _Libs = new MJWorks00LibsMain();
    _Libs.RunLibsMain(this);
    //▼ボタン
    _Main.GetButton("");
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■DOM取得の一般化
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【メソッド】DOM取得querySelector
  PT.GetDOM = function(domSelector, parent) {
    var dom = parent == null ? document : parent;
    return dom.querySelector(domSelector);
  };
  //■【メソッド】DOM取得querySelector
  PT.GetDOMs = function(domSelector, parent) {
    var dom = parent == null ? document : parent;
    return dom.querySelectorAll(domSelector);
  };

  //■【メソッド】指定の属性値を取得
  PT.GetCustom = function(param) {
    var dom = param.DOM;
    var custom = param.Custom;
    var tag = dom.tagName.toLowerCase();
    var temp =dom.dataset[custom];
    if( tag != "body" && temp == null ) {
      return _Main.GetCustom({DOM:dom.parentNode, Custom:custom});
    }
    return temp;
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■ボタンの実装：左クリック
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  PT.GetButton = function(param) {
    var btns = _Main.GetDOMs(param + ' [data-act]');
    if( btns.length == 0 ) { return; }//取得できなかったら何もせずにreturn
    for( var b=0;b<btns.length;b++ ) {
      var nBTN = btns[b];
      nBTN.removeEventListener('click', _Main.SetButton, false);
      nBTN.addEventListener('click', _Main.SetButton, false);
    }
  };
  PT.SetButton = function(param) {
    var dom = param.target;
    var action = _Main.GetCustom({DOM:dom, Custom:"act"})
    _Libs[action]({DOM:dom});
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■共通ヘッダーDOM
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  PT.CommonHeader = function() {
    var domString = ""
    + '<h1>■MJLibs</h1>'
    return domString;
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【return】
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  return MJWorks00Main;
})();

/*==============================================================================
//■【起動】
================================================================================*/
window.addEventListener("DOMContentLoaded", function() {
  var main = new MJWorks00Main();
  main.MainStart();
}, false);
