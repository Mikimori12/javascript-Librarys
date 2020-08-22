/*==============================================================================
  ■JMWorksLibAudio：オーディオライブラリ
================================================================================*/
var JMWorksLibAudio = (function() {

  //■【メンバ変数】
  var _Audio, _AudioContext, _AudioSource;

  //■【コンストラクタ】
  var JMWorksLibAudio = function(param) {
    //▼設定
    _Audio = this;
    _AudioContext = new (window.AudioContext || window.webkitAudioContext);
  };
  var PT = JMWorksLibAudio.prototype;

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■起動
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //▼起動
  PT.RunAudio = function() {
    console.log('audio')
    //音源ロード
    _Audio.LoadingAudioSource();
    _AudioSource.start(0);
    //再生
  };
  //▼音源の読み込み
  PT.LoadingAudioSource = function() {
    _AudioSource = _AudioContext.createBufferSource();
    var request = new XMLHttpRequest();
    request.open('GET','images/test.mp3', true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
      console.log('onload ya')
      var audioData = request.response;
      
      _AudioContext.decodeAudioData(audioData, function(buffer) {
        _AudioSource.buffer = buffer;
        _AudioSource.connect(_AudioContext.destination);
        _AudioSource.loop = true;
      }, function(e) {console.log("error")});
    }
    request.send();
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【return】
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  return JMWorksLibAudio;
})();

