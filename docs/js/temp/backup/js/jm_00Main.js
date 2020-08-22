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
    this.LDA = new JMWorksLibLoading({Method:"CirclingBallsGroup", Wid:100, Timing:100, Back:"rgba(0,0,0,0)"});
    this.CFG = new JMWorksConfig(this);
    this.CMN = new JMWorksCommon(this);
    this.PTS = new JMWorksParts(this);
    this.MTD = new JMWorksMethods(this);
    this.BTN = new JMWorksButtonControler(this);
    this.TTT = "test Dayo";
    _Main = this;
    //▼ライブラリをメンバ変数に代入
    _Methods = this.MTD;
    _Config = this.CFG;
    _Button = this.BTN;
    _Parts = this.PTS;
    _Common = this.CMN;
    _Loading = this.LDA;
    this.Info = {
      _Methods : "MTD", _Config:"CFG", _Button:"BTN", _Parts:"PTS", _Test:"TTT", _Private:"PRV"
    };
  };
  var PT = JMWorksMain.prototype;

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【メソッド】
  PT.MainStart = function() {
  console.log('■main start')
    //▼
    _Methods.TestMethod();
    var ttt = new window["JMPrivate_index"]();
    ttt.Initialize(this);
    ttt.PrivateTest();
    //▼HTMLにリンクされた外部javascriptファイル名を取得
    var instances = {};
    var scripts = document.querySelectorAll('script');
    for( var s=0;s<scripts.length;s++ ) {
      var nS = scripts[s];
      var temp = nS.src.toString().split('/')
      var fileName = temp[ temp.length-1 ].split('.')[0];
      instances[fileName] = fileName;
    }
    //▼カレンダー
    var calender = new JMWorksLibCalender();
    calender.FocusToInput('input.Calender');
    //▼canvasマウスオーバー
    var data = new JMDataCanvas();
    var canvas = new JMWorksLibCanvas(this);
    canvas.RunLibCanvas(data.Humans());
    //▼ヘルプドキュメント実装
    var help = new JMWorksLibMouseoverDocument({});
    help.RunHelpdocumentLibrary();
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
