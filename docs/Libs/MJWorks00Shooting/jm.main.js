//*******************************************************************
//■研修用javascript
//*******************************************************************
//■global変数
var cBOX = { 'w':400,'h':300 };//ゲームフィールドの大きさ
var mob = {};//敵データ格納用配列
var gun = {};//敵弾データ
var gunNum = 0;//敵弾の総数
var bit = {};//ボスビットデータの格納用配列
var mch;//myキャラデータ格納用配列
var bem = {};//自機弾データ
var bemNum = 1;//自機弾の番号
var nscore = 0;
var mP = {'X':0,'Y':0};//マウスポインタの座標
var gmode='';
var btnColor = {
  'normal':['rgba(110,245,245,1)','rgba(0,160,235,1)','rgba(0,0,180,1)',
           'rgba(160,255,245,0.4)','rgba(120,255,255,1)'],
  'mon':['rgba(255,180,130,1)','rgba(225,80,0,1)','rgba(120,0,0,1)',
           'rgba(255,0,0,0.5)','rgba(255,120,120,1)']
};
var mmove = 'normal';
var sTime=0;
var gangle=20;

//■global定数
var T_DIV_ID = 'jmTime';
var TEST_DIV_ID = 'jmXY';
var G_DIV_ID = 'jmBOX';
var G_CANVAS_NAME = 'gameField';
var ASCENE_EXPL = 'explosion';
var ASCENE_FIRE = 'fire';
var ASCENE_HIT = 'hit';
var MODE_START = 'start';
var MODE_PLAY = 'play';
var MODE_OVER = 'over';

//■begin.mainFrame()：メイン関数
function mainFrame() {
  window.onload = function () {
    //▼起動時の各種初期化
    gmode = MODE_START;
    //ゲームフィールドcanvasの生成
    makeCanvas(G_CANVAS_NAME,cBOX,G_DIV_ID);//ゲームフィールドcanvasの設置
    //敵＆ボス（mobAllScriptからすべての敵データを確保しておく）
    for( var i in mobAllScript ) {
      var MAS = mobAllScript[i];
      var enNM = OBNAME_ENEMY[MAS[2]];
      var chD = charaAppearance[ enNM ];
      if(MAS[2]==1)enNM += i;
      mob[enNM] = new makeCharaObject();
      mob[enNM].obname = enNM;
      mob[enNM].setMobMoveType( MAS[3] );
      //アニメデータの確保
      mob[enNM].anime.imgdata = chD[1];
      mob[enNM].anime.asize = chD[0];
      //他をまとめて初期化
      mobDataInit( enNM,mob[enNM],MAS );
      //ボスの当たり判定サイズ
      if( enNM==OBNAME_ENEMY[2] ) {
        mob[enNM].size.w = mob[enNM].anime.asize.w-20;
        mob[enNM].size.h = mob[enNM].anime.asize.h-20;
        //ボスの時はビットを追加する処理
        for( var b in bossBit ) {
          var bitN = OBNAME_ENEMY[3]+b;
          var nBIT = bossBit[b];
          var bAPP = nBIT[2];
          chD = charaAppearance[ OBNAME_ENEMY[bAPP] ];
          bit[ bitN ] = new makeCharaObject();
          bit[ bitN ].obname = bitN;
          bit[ bitN ].vector.mX = nBIT[3][0];
          bit[ bitN ].vector.mY = nBIT[3][1];
          bit[ bitN ].position.pX = mob[OBNAME_ENEMY[2]].position.pX + nBIT[3][0];
          bit[ bitN ].position.pY = mob[OBNAME_ENEMY[2]].position.pY + nBIT[3][1];
          bit[ bitN ].speed = 1;
          bit[ bitN ].movestate.HP = 3;
          bit[ bitN ].score = [100,300];
          bit[ bitN ].bullet.num = nBIT[1];
          bit[ bitN ].bullet.style = mobBulletType[ nBIT[0] ];
          bit[ bitN ].anime.imgdata = chD[1];
          bit[ bitN ].anime.asize = chD[0];
          bit[ bitN ].setAnimationInit();
        }
      }
    }

    //自機
    mch = new makeCharaObject();
    mch.obname = OBNAME_MY;
    var mCA = charaAppearance[mch.obname];
    mch.movestate.HP = 3;
    mch.anime.imgdata = mCA[1];
    mch.anime.asize = mCA[0];
    mch.setAnimationInit();
    mch.position.pX = (cBOX.w*0.5);
    mch.position.pY = cBOX.h - (mch.size.h*0.5)-5;
    mch.FLG.display = true;

    //▼タイトル画面表示
    backGroundDraw();
    mch.characterDraw();
    buttonStartDraw(btnColor[mmove]);
    gameTitleDraw();

    //▼メイン処理ループ
    var mainActionLoop = function () {
      var nTM = Math.ceil( gSec - (mFrame/FPS) );
      //全キャラの座標位置や生死フラグを更新してゲームフィールドに描画
      setCharacters(G_CANVAS_NAME);
      playTimeShow( nTM );//タイム表示
      if( mch.FLG.display ) {//自機が生きているかどうか
        if( mob[OBNAME_ENEMY[2]].movestate.HP==0 && !mob[OBNAME_ENEMY[2]].FLG.display) {
          //ボスを破壊できたら終了
            gmode=MODE_OVER;
            gameOverMessage(2);
            clearTimeout(TOID);
        } else {
          //ボスを破壊してないならループ続行
          callBackFrame(mainActionLoop,function(){
            gmode=MODE_OVER;
            gameOverMessage(1);
          });
        }
      } else {
        gmode=MODE_OVER;
        gameOverMessage(3);
      }
    };

    //▼マウスの挙動設定
    //フィールド内でのマウスポインタ座標の取得
    cv[G_CANVAS_NAME].addEventListener('mousemove',function(e){
      mP.X = e.pageX-cv[G_CANVAS_NAME].getBoundingClientRect().x;
      mP.Y = e.pageY-cv[G_CANVAS_NAME].getBoundingClientRect().y
      switch( gmode ){
        case MODE_START:
          mouseMoveSTART(mP.X,mP.Y);
          break;
        case MODE_PLAY:
          mouseMovePLAY(mP.X,mP.Y);
          break;
        case MODE_OVER:
          break;
      }
    },false);
    //フィールド内でマウスクリックの挙動
    cv[G_CANVAS_NAME].addEventListener('mousedown',function(e){
      switch( gmode ){
        case MODE_START:
          if(mmove=='mon') {
            //スタートボタンを押したらメイン処理開始
            gmode = MODE_PLAY;
            mainActionLoop();
          }
          break;
        case MODE_PLAY:
          mouseDownPLAY();
          break;
      }
    },false);
    //Enterでリトライするために初期化
    window.addEventListener('keydown',function(ev){
      if(ev.key=='Enter' && gmode==MODE_OVER) {
          gmode=MODE_PLAY;
          mmove='normal';
          gun = {};
          bem = {};
          //敵キャラの初期化
          for( var i in mobAllScript ) {
            var MAS = mobAllScript[i];
            var enNM = OBNAME_ENEMY[MAS[2]];
            if(MAS[2]==1)enNM += i;
            mobDataInit( enNM,mob[enNM],MAS );
          }
          for( var b in bossBit ) {
            var bitN = OBNAME_ENEMY[3]+b;
            var nB = bit[bitN];
            nB.FLG.alive = true;
            nB.FLG.display = false;
            nB.movestate.HP = 3;
            nB.bullet.num = bossBit[b][1];
            nB.setAnimationInit();
          }
          //自機の初期化
          mch.setAnimationInit();
          mch.position.pX = (cBOX.w*0.5);
          mch.position.pY = cBOX.h - (mch.size.h*0.5)-5;
          mch.movestate.HP = 3;
          mch.FLG.display = true;
          mch.FLG.alive = true;
          mFrame=0;
          nscore = 0;
          mainActionLoop();
      }
    },false);
  };
  //ゲームプレイ中：マウスのゲームフィールド内座標取得
  function mouseMovePLAY(mpx,mpy){
      var hW = cBOX.w-mch.size.w*0.5;
      var hH = cBOX.h-mch.size.h*0.5;
      if(
        ( mpx >= 10 && mpx <= hW ) && ( mpy >= 10 && mpy <= hH )
          && mch.FLG.alive ) {
        mch.position.pX = mpx;
        mch.position.pY = mpy;
      }
  }
  //スタート画面：スタートボタンにマウスオンオフで色変更
  function mouseMoveSTART(mpx,mpy){
    var kW = keyP[1]-keyP[0];
    var kSP = (cBOX.w-(keyP[1]-keyP[0]))*0.5;
    if( ( mpx>=kSP && mpx<=(kSP+kW) ) && ( mpy>=(keyP[4]+10) && mpy<=(keyP[4]+40) ) ) {
      if( mmove=='normal' ) {
        mmove='mon';
      }
    } else {
      if( mmove=='mon' ) {
        mmove='normal';
      }
    }
    ct[G_CANVAS_NAME].clearRect(0,0,cBOX.w,cBOX.H);
    backGroundDraw();
    mch.characterDraw();
    buttonStartDraw(btnColor[mmove]);
    gameTitleDraw();
  }
  //ゲームプレイ中：左クリックの挙動実装
  function mouseDownPLAY() {
      if(mch.FLG.alive) {
        var gg = new makeCharaObject();
        gg.size = {'w':2,'h':2};
        gg.position.pX = mch.position.pX-(gg.size.w*0.5);
        gg.position.pY = mch.position.pY-gg.size.h;
        gg.setMobMoveAmount(13);
        gg.color = 'rgba(140,255,140,1)';
        gg.FLG.alive = true;
        bem[bemNum] = gg;
        //フィールド内の弾数の更新
        bemNum++;
        //スコア加算
        nscore+=10;
      }
  }
}

//■敵キャラ初期化関数
function mobDataInit(nNM,mDI,mS) {
  mDI.FLG.alive = true;
  mDI.FLG.display = false;
  mDI.movestate.frame = 0;
  mDI.movestate.sframe = 0;
  mDI.movestate.state = 0;
  mDI.movestate.dframe = mS[0];
  mDI.position.pX = mS[1][0];
  mDI.position.pY = mS[1][1];
  mDI.bullet.num = mS[4];
  mDI.bullet.style = mobBulletType[ mS[5] ];
  mDI.movestate.maxFrame = mDI.movescript[0][1];
  mDI.setMobMoveAmount(mDI.movescript[0][0]);//出現時の移動量を算出
  mDI.setAnimationInit();
  //HPとスコアの設定
  if( nNM==OBNAME_ENEMY[2] ) {
      mDI.movestate.HP = 20;
      mDI.score = [200,2000];
  } else {
      mDI.movestate.HP = 1;
      mDI.score = [100,100];
  }
}
//end.mainFrame()

//■begin.setCharacters()：繰り返し処理関数
function setCharacters(GF) {
  //▼出現・座標の更新
  //敵キャラ
  for( var i in mob ) {
    var nM = mob[i];
    //移動開始フレームになったら
    if(nM.movestate.dframe == mFrame) {
      nM.FLG.display = true;//表示開始位置判定
      nM.anime.state = 1;
      if( i==OBNAME_ENEMY[2] ) {
        //ボスならビットもdisplayをtrue
        for( var b in bit ) {
          bit[b].FLG.display = true;
        }
      }
    }
    //displayがtrueなら
    if(nM.FLG.display) {
      if( nM.movestate.frame == nM.movestate.maxFrame ) {
        //移動方向が変わったので移動状態を変更
        nM.movestate.frame = 0;
        nM.movestate.state++;
        var nMS = nM.movescript[nM.movestate.state];
        if( nMS == null ) {
          //次のスクリプトが無ければ表示をfalseにして再描画しない
          nM.FLG.display = false;
        } else {
          nM.movestate.maxFrame = nMS[1];
          //移動量を再計算
          nM.setMobMoveAmount(nMS[0]);
        }
      }
      //軌道ナンバーが１８以上の時は繰り返し運動として移動量を算出
      var nMS = nM.movescript[nM.movestate.state];
      setSpecialMove(nMS[0],nM);//繰り返し運動の移動量算出関数
      //座標の更新
      if(nM.FLG.alive)nM.movePosition();
      //内部フレームの更新
      nM.movestate.frame++;
      //範囲による生死判定
      nM.judgeField();
      //弾発射で残弾数があればgunに登録
      var nMF = nM.movestate.frame%nM.bullet.style[2];
      if( nMF==1 && nM.FLG.alive && nMS[2]>=1 && nM.bullet.num>0 ) {
        var gXY = [ nM.position.pX, nM.position.pY ];
          setMobBullet( gXY, nM.bullet.style );
          //残弾数を減らす
          nM.bullet.num--;
        //ボスの発射アニメをセット
        if(i==OBNAME_ENEMY[2]) {
          mob[i].setAnimationAllSame(ASCENE_FIRE);
        }
      }
    }
  }
  //ビット
  if(mob[OBNAME_ENEMY[2]]) {
  var mBS = mob[OBNAME_ENEMY[2]];
  if( mBS.FLG.display && mBS.FLG.alive ){
    for( var b in bit ) {
      var nB = bit[b];
      if( nB.FLG.alive ) {
        //ボス依存で座標更新
        nB.position.pX = mBS.position.pX;
        nB.position.pY = mBS.position.pY;
        nB.movePosition();
        nB.judgeField();
        //内部フレームの更新
        nB.movestate.frame++;
        //弾発射で残弾数があればgunに登録
        var nBF = nB.movestate.frame%nB.bullet.style[2];
        if( nBF==4 && nB.FLG.display && nB.bullet.num>0 ) {
          var gXY = [ nB.position.pX, nB.position.pY ];
          setMobBullet( gXY,nB.bullet.style );
          //残弾数を減らす
          nB.bullet.num--;
          nB.setAnimationAllSame(ASCENE_FIRE);
        }
      }
    }
  }
  }
  //敵弾
  for( var j in gun ) {
    var nG = gun[j];
    if( nG.FLG.alive ) {
      nG.movePosition();
      nG.judgeField();
    }
  }
    //自機弾
    for( var k in bem ) {
      var nB = bem[k];
      if( nB.FLG.alive ) {
        nB.movePosition()
        nB.judgeField();
      }
    }
  //自機キャラ
  mch.movePosition();

  //▼当たり判定判定とアニメーション指定
  //敵キャラｘ自機弾
  for( var en in mob ) {
    if( mob[en].FLG.alive ) {
      mob[en].judgeBump(bem);
    }
  }
  //ボスビットｘ自機弾
  for( var bt in bit ) {
    if( bit[bt].FLG.alive ) {
      bit[bt].judgeBump(bem);
    }
  }
  //自機キャラｘ敵弾
  mch.judgeBump(gun);

  //▼全キャラの描画
  ct[G_CANVAS_NAME].setTransform(1,0,0,1,0,0);
  ct[G_CANVAS_NAME].clearRect(0,0,cBOX.w,cBOX.h);//一旦、ゲームフィールドをクリア
  backGroundDraw();//背景描画
  //敵キャラ
  for( var z in mob ) {
    if(mob[z].FLG.display) {
      mob[z].characterDraw();
    }
  }
  //ボスビット
  for( var b in bit ) {
    if(bit[b].FLG.display) {
      bit[b].characterDraw();
    }
  }
  //敵弾
  for( var z in gun ) {
    var nC = gun[z];
    if( nC.FLG.alive ) {
      mobGunDraw( nC )
    }
  }
  //自機弾
  for( var z in bem ) {
    var nC = bem[z];
    if( nC.FLG.alive ) {
      myBeemDraw( nC );
    }
  }
  //自機
  mch.characterDraw();
  scoreShow();
}
//end.setCharacters()
