//*******************************************************************
//■研修用javascript
//　jm.common
//　使い回しの利く汎用的で小さな関数をまとめる
//*******************************************************************
//■timeoutによる繰り返し処理関数
var FPS = 30;//毎秒のフレーム数
var ToFrame = 1000 / FPS;//setTimeout指定値
var gSec = 25;//ゲームプレイ制限時間　秒
var maxFrame = gSec * FPS;//最大フレーム数
var mFrame = 1;//制御フレーム初期値
var TOID=0;
function callBackFrame( arg, endarg ) {
  if( mFrame < maxFrame ) {
    mFrame++;
    TOID = setTimeout(arg,ToFrame);
  } else {
    endarg();
  }
}
//end.callBackFrame()
//■begin.makeCanvas()：canvasの作成
var cv = {};//canvas
var ct = {};//context
function makeCanvas(cvname,bb,cvbox) {
  cv[cvname] = document.createElement('canvas');
  cv[cvname].setAttribute('width',bb.w);
  cv[cvname].setAttribute('height',bb.h);
  ct[cvname] = cv[cvname].getContext('2d');
  if(cvbox!=null) {
    document.all[cvbox].appendChild(cv[cvname]);
  }
}
//end.makeCanvas()
//■begin.timeDOM()：現在のタイムスタンプの取得と表示
function timeDOM ( jmTime,sTime,comment ) {
  var gT = (( new Date().getTime() - sTime )*0.001).toFixed(1);
  document.all[jmTime].innerText = gT+comment;
}
//end.timeDOM()

