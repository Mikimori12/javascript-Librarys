/*==============================================================================
  ■MJLibs01LoadingAnimation：ローディングアニメーションライブラリ
================================================================================*/
var MJLibs01LoadingAnimation = (function() {

  //■【メンバ変数】
  var _LoadingID, _Loading, _LoadingWid, _LoadingCount, _LoadingBall;
  var _LoadingCtx, _LoadingName, _LoadingBack, _LoadingRGB, _LoadingZ;
  var _LoadingMethod,_LoadingTiming, _LoadingABC, _LoadingGroup;

  //■【コンストラクタ】
  var MJLibs01LoadingAnimation = function(param) {
    _Loading = this;
    //設定：共通
    _LoadingZ = param.Z || "9999";//z-index値
    _LoadingWid = param.Wid || 100;//canvasの縦横サイズ
    _LoadingTiming = param.Timing || 100;//ローディングタイミング
    _LoadingMethod = param.Method || "CirclingBall";//再生するローディングアニメーションを指定
    _LoadingName = param.Name || "LoadingAnimationLibrary";//canvasName
    _LoadingBack = param.Back || "rgba(0,0,0,0.1)";//ローディングアニメーションの背景色
    _LoadingRGB = param.RGB || { R:0,G:120,B:255 };//ローディングアニメーションの色
    //設定：CirclingBall
    _LoadingBall = param.R || 6;//ボール半径
    //設定：DoubleCircleWave
    _LoadingABC = { A:0, B:0, C:0 };
    //グローバル変数
    _LoadingCount = 0;//現在の回転位置0～11
    _LoadingFrame = 0;
    _LoadingGroup = 1;
    _LoadingBall = { 1:0.8, 2:0.7, 3:0.6, 4:0.5, 5:0.4, 6:0.3, 7:0.2, 8:0.1 };
    _LoadingLazer = { Fr:1, To:0 };
    _LoadingID = 0;//アニメーションID
    _LoadingCtx = null;//context
    //canvas生成
    _Loading.MakeCanvas();
  };
  var PT = MJLibs01LoadingAnimation.prototype;

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■アニメーション制御
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //▼再生
  PT.Start = function(param) {
    //ローディングIDを削除しておく
    _Loading.Stop();
    //再生するアニメ
    _LoadingMethod = param == null ? _LoadingMethod : param;
    //window.clearInterval(_LoadingID);
    //表示
    document.querySelector('[data-library="'+_LoadingName+'"]').style.display = "";
    _LoadingID = window.setInterval(_Loading[ _LoadingMethod ], _LoadingTiming);
  };

  //▼停止
  PT.Stop = function() {
    document.querySelector('[data-library="'+_LoadingName+'"]').style.display = "none";
    window.clearInterval(_LoadingID);
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■ローディングアニメーション４：CirclingBallsWave
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  PT.CirclingBallsWave = function() {
    _LoadingCtx.clearRect(0,0,_LoadingWid,_LoadingWid);
    for( var i=1;i<=8;i++ ) {
      var xy = _Loading.BallsPlace(i);
      _LoadingCtx.globalCompositeOperation = 'source-over';
      _LoadingCtx.beginPath();
      _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+",1)";
      _LoadingCtx.globalAlpha = 1+(1-i)*0.1;
      _LoadingCtx.arc(xy.X,xy.Y,xy.R,0,Math.PI*2,true);
      _LoadingCtx.closePath();
      _LoadingCtx.fill();
    }
    //ローディングカウントのカウントアップ
    _Loading.CountUp();
    _LoadingFrame++;
  };
  //▼ボールの位置
  PT.BallsPlace = function(param) {
    var angle = param;
    var mov = 60 * Math.cos(0.14*(angle+_LoadingFrame)) * Math.PI/180;
    if( mov <= -0.2 ) {
      mov = -0.2;
    }
    if( mov >= 0.4 ) {
      mov = 0.4;
    }
    _LoadingBall[angle] += 0.28+mov;
    var xy = _LoadingWid/2;
    var r = Math.floor(6 * _LoadingWid / 100 );
    var x = xy + (xy-r*2) * Math.cos( _LoadingBall[angle] );
    var y = xy + (xy-r*2) * Math.sin( _LoadingBall[angle] );
    return { X:x, Y:y, R:r };
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■ローディングアニメーション３：ダブルサークルウェーブ
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  PT.DoubleCircleWave = function() {
    _Loading.Kasoku();
    var soto = { Fr:_LoadingABC.A, To:_LoadingABC.B };
    var uchi = { Fr:_LoadingCount, To:_LoadingCount+1 };
    var xy = _Loading.CalcurateR();
    _LoadingCtx.clearRect(0,0,_LoadingWid,_LoadingWid);
    //外
    _LoadingCtx.globalCompositeOperation = 'source-over';
    _LoadingCtx.beginPath();
    _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+",1)";
    _LoadingCtx.globalAlpha = 1;
    _LoadingCtx.arc(xy.XY,xy.XY,xy.R1,(Math.PI/6)*soto.Fr,(Math.PI/6)*soto.To,true);
    _LoadingCtx.lineTo(xy.XY,xy.XY);
    _LoadingCtx.closePath();
    _LoadingCtx.fill();
    _LoadingCtx.globalCompositeOperation = 'destination-out';
    _LoadingCtx.beginPath();
    _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+",1)";
    _LoadingCtx.globalAlpha = 1;
    _LoadingCtx.arc(xy.XY,xy.XY,xy.R2,0,(Math.PI/6)*12,true);
    _LoadingCtx.lineTo(xy.XY,xy.XY);
    _LoadingCtx.closePath();
    _LoadingCtx.fill();
    //内
    _LoadingCtx.globalCompositeOperation = 'source-over';
    _LoadingCtx.beginPath();
    _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+",0.5)";
    _LoadingCtx.globalAlpha = 1;
    _LoadingCtx.arc(xy.XY,xy.XY,xy.R3,(Math.PI/6)*uchi.Fr,(Math.PI/6)*uchi.To,true);
    _LoadingCtx.lineTo(xy.XY,xy.XY);
    _LoadingCtx.closePath();
    _LoadingCtx.fill();
    _LoadingCtx.globalCompositeOperation = 'destination-out';
    _LoadingCtx.beginPath();
    _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+",1)";
    _LoadingCtx.globalAlpha = 1;
    _LoadingCtx.arc(xy.XY,xy.XY,xy.R4,0,(Math.PI/6)*12,true);
    _LoadingCtx.lineTo(xy.XY,xy.XY);
    _LoadingCtx.closePath();
    _LoadingCtx.fill();
    //ローディングカウントのカウントアップ
    _Loading.CountUp();
  };
  //▼減衰角度
  PT.Kasoku = function() {
    if( _LoadingABC.C%2 == 0 ) {
      _LoadingABC.A -= ( 1 + _LoadingCount ) / 12;
      _LoadingABC.B -= 1.32;
    } else {
      _LoadingABC.A -= 1.32;
      _LoadingABC.B -= ( 1 + _LoadingCount ) / 12;
    }
    if( Math.abs(_LoadingABC.A - _LoadingABC.B) <= 1 ) {
      _LoadingABC.A = _LoadingABC.B + 1;
    }
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■ローディングアニメーション２：ダブルサークル
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  PT.DoubleCircle = function() {
    var soto = { Fr:8-_LoadingCount, To:1-_LoadingCount };
    var uchi = { Fr:_LoadingCount, To:_LoadingCount+1 };
    var xy = _Loading.CalcurateR();
    _LoadingCtx.clearRect(0,0,_LoadingWid,_LoadingWid);
    //外
    _LoadingCtx.globalCompositeOperation = 'source-over';
    _LoadingCtx.beginPath();
    _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+",1)";
    _LoadingCtx.globalAlpha = 1;
    _LoadingCtx.arc(xy.XY,xy.XY,xy.R1,(Math.PI/6)*soto.Fr,(Math.PI/6)*soto.To,true);
    _LoadingCtx.lineTo(xy.XY,xy.XY);
    _LoadingCtx.closePath();
    _LoadingCtx.fill();
    _LoadingCtx.globalCompositeOperation = 'destination-out';
    _LoadingCtx.beginPath();
    _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+",1)";
    _LoadingCtx.arc(xy.XY,xy.XY,xy.R2,0,(Math.PI/6)*12,true);
    _LoadingCtx.lineTo(xy.XY,xy.XY);
    _LoadingCtx.closePath();
    _LoadingCtx.fill();
    //内
    _LoadingCtx.globalCompositeOperation = 'source-over';
    _LoadingCtx.beginPath();
    _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+",0.5)";
    _LoadingCtx.globalAlpha = 1;
    _LoadingCtx.arc(xy.XY,xy.XY,xy.R3,(Math.PI/6)*uchi.Fr,(Math.PI/6)*uchi.To,true);
    _LoadingCtx.lineTo(xy.XY,xy.XY);
    _LoadingCtx.closePath();
    _LoadingCtx.fill();
    _LoadingCtx.globalCompositeOperation = 'destination-out';
    _LoadingCtx.beginPath();
    _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+",1)";
    _LoadingCtx.globalAlpha = 1;
    _LoadingCtx.arc(xy.XY,xy.XY,xy.R4,0,(Math.PI/6)*12,true);
    _LoadingCtx.lineTo(xy.XY,xy.XY);
    _LoadingCtx.closePath();
    _LoadingCtx.fill();
    //ローディングカウントのカウントアップ
    _Loading.CountUp();
  };
  //▼半径の算出
  PT.CalcurateR = function() {
    var xy =Math.floor( _LoadingWid / 2 );
    var r = xy - ( _LoadingWid / 10 );
    var r2 = r*0.8;
    var r3 = r2 - 2;
    return { XY:xy, R1:r, R2:r2, R3:r3, R4:r3*0.75 };
  };
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■ローディングアニメーション１：回転ボール
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  PT.CirclingBall = function() {
    var countFrom = -3 + _LoadingCount;
    var countTo = 9 + _LoadingCount;
    var num = 0;
    _LoadingCtx.clearRect(0,0,_LoadingWid,_LoadingWid);
    for( var i=countFrom;i<countTo;i++) {
      var xy = _Loading.GetXY(i*30);
      var opa = 0.1+ Math.round((num*1/12)*10)/10;
      _LoadingCtx.globalCompositeOperation = 'source-over';
      _LoadingCtx.beginPath();
      _LoadingCtx.fillStyle = "rgba("+_LoadingRGB.R+","+_LoadingRGB.G+","+_LoadingRGB.B+","+opa+")";
      _LoadingCtx.globalAlpha = opa;
      _LoadingCtx.arc(xy.X,xy.Y,xy.R,0,Math.PI*2,true);
      _LoadingCtx.closePath();
      _LoadingCtx.fill();
      num++;
    }
    //ローディングカウントのカウントアップ
    _Loading.CountUp();
  };
  //▼ボールの配置座標算出
  PT.GetXY = function(param) {
    var angle = param;
    var rad = angle * Math.PI/180;
    var xy = _LoadingWid/2;
    var r = Math.floor(6 * _LoadingWid / 100 );
    var x = xy + (xy-r*2) * Math.cos( rad );
    var y = xy + (xy-r*2) * Math.sin( rad );
    return { X:x, Y:y, R:r };
  };
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■共通
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //▼canvas生成 ※コンストラクタで呼び出し
  PT.MakeCanvas = function(param) {
    //cnvas生成
    var canvas = document.createElement('canvas');
    _LoadingCtx = canvas.getContext('2d');
    canvas.setAttribute('data-library',_LoadingName);
    canvas.setAttribute('width', _LoadingWid);
    canvas.setAttribute('height',_LoadingWid);
    canvas.style.backgroundColor = _LoadingBack;
    canvas.style.position = "fixed";
    canvas.style.zIndex = _LoadingZ;
    canvas.style.display = "none";
    //bodyに挿入
    document.body.appendChild(canvas);
    //位置調整
    _Loading.GetSizeBrowser()
    //ブラウザサイズが変更されたときに表示位置を調整する
    window.addEventListener('resize', function(e) {
      _Loading.GetSizeBrowser();
    }, false);
  };

  //▼カウントアップ
  PT.CountUp = function() {
    _LoadingCount += 1;
    if( _LoadingCount == 12 ) {
      _LoadingCount = 0;
      _LoadingABC.C += 1;
    }
  };
  //▼ブラウザサイズを取得して位置調整
  PT.GetSizeBrowser = function() {
    var can = document.querySelector('[data-library="'+_LoadingName+'"]');
    var widBrowser = document.documentElement.clientWidth;
    var heiBrowser = document.documentElement.clientHeight;
    can.style.top = Math.floor((heiBrowser-_LoadingWid)/2)+'px';
    can.style.left = Math.floor((widBrowser-_LoadingWid)/2)+'px';
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【return】
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  return MJLibs01LoadingAnimation;
})();

