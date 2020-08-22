/*==============================================================================
  ■jmworks：メインクラス
================================================================================*/
var JMWorksMain = (function() {

  //■【メンバ変数】
  var _Main, _Methods, _Button, _Parts, _Config, _Common, _TTT, _Loading;

  //■【コンストラクタ】
  var JMWorksMain = function() {
    //▼javascriptライブラリのインスタンス化
    this.MAIN = this;
  };
  var PT = JMWorksMain.prototype;

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【メソッド】
  PT.MainStart = function() {
  console.log('■main start')
    //▼TensorFlow
    tf.tensor([[1,2],[2,2]]).print();
    //▼Audio
    var audio = new JMWorksLibAudio();
    audio.RunAudio();
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【return】
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  return JMWorksMain;
})();

/*==============================================================================
//■【起動】
================================================================================*/
window.addEventListener("DOMContentLoaded", function() {
  var main = new JMWorksMain();
  main.MainStart();
}, false);
