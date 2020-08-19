//*******************************************************************
//■研修用javascript
//　キャラ生成＆動き制御
//*******************************************************************
//■makeCharaObject()：キャラ生成データ
function makeCharaObject() {
  this.obname = '';//オブジェクト名
  this.position = {'pX':0,'pY':0};//表示中心座標
  this.vector = {'mX':0,'mY':0};//移動単位ベクトル量
  this.speed = 120/FPS;//1フレームあたりの移動量調整値
  this.size = {'w':20,'h':20};//当たり判定サイズ
  this.color = 'rgba(220,180,255,1)';//オブジェクトの基本カラー
  this.bullet = {'num':10,'style':[]};//残弾数
  this.FLG = {'alive':true,'display':false};//状態フラグ
  this.score = [0,0];
  this.movescript = [];//移動軌道データ群
  this.movestate = {//移動状態に関するデータ
    'state':0,//移動スクリプトナンバー
    'dframe':0,//表示開始フレーム
    'frame':0,//内部カウントフレーム
    'sframe':0,//内部カウント補助フレーム
    'maxFrame':0,//行動切り替えタイミングフレーム
    'HP':0//HP、ゼロになったら死亡
  };
  this.anime = {
    'asize' : {'w':0,'h':0},//描画範囲サイズ
    'astate' : {},//現在のtransform情報
    'imgdata' : []//元データ
  };
}
//座標の更新
makeCharaObject.prototype.movePosition = function () {
  this.position.pX += this.vector.mX * this.speed;
  this.position.pY += this.vector.mY * this.speed;
};
//範囲による描画フラグ判定
makeCharaObject.prototype.judgeField = function () {
  var szW = this.size.w*0.5;
  var szH = this.size.h*0.5;
  //描画範囲の判定
  if( this.position.pX < -szW || this.position.pX > (cBOX.w+szW) ||
      this.position.pY < -szH || this.position.pY > (cBOX.h+szH)) {
    this.FLG.display = false;
  } else {
    if(this.FLG.alive && !this.FLG.display) {
      this.FLG.display = true;
    }
  }
};
//当たり判定
makeCharaObject.prototype.judgeBump = function (mR) {
  var myMM = getXYMaxMin(this.position,this.size);
  for( var k in mR ) {
    if( mR[k].FLG.alive == true ) {
      //互いの範囲から当たり判定
      var nMM = getXYMaxMin(mR[k].position,mR[k].size);
      if( ( nMM.minX >= myMM.minX && nMM.minX <= myMM.maxX
      && nMM.minY >= myMM.minY && nMM.minY <= myMM.maxY )
      ||  ( nMM.minX >= myMM.minX && nMM.minX <= myMM.maxX
      && nMM.maxY >= myMM.minY && nMM.maxY <= myMM.maxY )
      ||  ( nMM.maxX >= myMM.minX && nMM.maxX <= myMM.maxX
      && nMM.maxY >= myMM.minY && nMM.maxY <= myMM.maxY )
      ||  ( nMM.maxX >= myMM.minX && nMM.maxX <= myMM.maxX
      && nMM.minY >= myMM.minY && nMM.minY <= myMM.maxY )
      ) {
        this.movestate.HP -= 1;
        //自機じゃなければヒットスコア加算
        if(this.obname!=OBNAME_MY) {
          nscore+=this.score[0];
        }
        //ボスor自機に着弾時の演出
        if( this.obname==OBNAME_ENEMY[2] || this.obname==OBNAME_MY ) {
          this.setAnimationAllSame(ASCENE_HIT+this.movestate.HP);
        }
        //ボスのHPが半分以下で弾タイプ変更
        if( this.obname==OBNAME_ENEMY[2] && this.movestate.HP<=10 ) {
          this.bullet.style = mobBulletType[ 4 ];
        }
        //HP０のときの処理
        if( this.movestate.HP <= 0 && this.FLG.alive ) {
          //自機じゃなければ破壊スコア加算
          if(this.obname!=OBNAME_MY) nscore+=this.score[1];
          this.FLG.alive = false;
          //各パーツのcolorとtransformを更新
          this.setAnimationAllSame(ASCENE_EXPL);
          //ボスの時はビットも一緒に爆発
          if(this.obname==OBNAME_ENEMY[2]) {
            for( var b in bit ) {
              var nB = bit[b];
              if(nB.FLG.alive) {
                nB.FLG.alive = false;
                nB.setAnimationAllSame(ASCENE_EXPL);
              }
            }
          }
        }
        //弾のaliveもfalse
        mR[k].FLG.alive = false;
      }
    }
  }
};
//自機に向かう単位ベクトル算出
makeCharaObject.prototype.vectorCals = function (vXY,vD) {
  this.vector.mX = -(vXY[0]/vD);
  this.vector.mY = -(vXY[1]/vD);
};
makeCharaObject.prototype.vectorXY = function (tageP) {
  return [this.position.pX-tageP[0],this.position.pY-tageP[1]];
}
makeCharaObject.prototype.vectorDistance = function (veX,veY) {
  return Math.sqrt(Math.pow(veX,2)+Math.pow(veY,2));
};
makeCharaObject.prototype.vectorAngle = function (vXY,vD) {
  return Math.acos( (vXY[0]/vD) )*180/Math.PI;
};
//16方向の1フレームあたりの移動量を算出
makeCharaObject.prototype.setMobMoveAmount = function (mMV) {
  var baseAngle = 22.5;
  var rad = baseAngle * (mMV-1) * Math.PI / 180;
  var zero = (mMV%17)/mMV;//17の時は0、それ以外は1
  //小数点4桁までに値を丸める
  var sx = zero*Math.floor(Math.cos(rad)*10000)*0.0001;
  var sy = zero*Math.floor(Math.sin(rad)*10000)*0.0001;
  this.vector.mX = sx;
  this.vector.mY = sy;
};
//end.makeCharaObject()
//■描画canvasにdrawしてアニメフレームを更新
makeCharaObject.prototype.characterDraw = function () {
  var nCT = ct[G_CANVAS_NAME];
  var mASZ = this.anime.asize;
  var mAR = this.anime.astate;
  var mAID = this.anime.imgdata;
  var allP = 0;
  var nPX = this.position.pX - mASZ.w*0.5;
  var nPY = this.position.pY - mASZ.h*0.5;
  //各パーツごとに処理
  for( var j in mAR ) {
    allP+=2;
    //各パーツのベジエデータ・カラー情報・トランスフォーム情報を取得
    var nCOL = mAR[j].Color[3];
    var nTRN = mAR[j].Trans[3];
    var nBZR = mAID[j].Bezier;
    //globalCompositeOperationの設定
    var nGCO = 'source-over';//初期値はsource-over
    //描画
    nCT.fillStyle = 'rgba('+nCOL[0]+','+nCOL[1]+','+nCOL[2]+','+nCOL[3]+')';
    nCT.beginPath();
    nCT.setTransform(nTRN[0],nTRN[1],nTRN[2],nTRN[3],nTRN[4]+nPX,nTRN[5]+nPY);
    for( var b in nBZR ) {
      var nB = nBZR[b];
      switch( nB[0] ) {
        case 'M':
          var nLAST = nB.length-1;
          if( nLAST>=3 ) {
            nGCO = nB[nLAST];
          }
          nCT.globalCompositeOperation = nGCO;
          nCT.moveTo(nB[1],nB[2]);
          break;
        case 'A':
          var nLAST = nB.length-1;
          if( nLAST>=7 ) {
            nGCO = nB[nLAST];
          }
          nCT.globalCompositeOperation = nGCO;
          nCT.arc(nB[1],nB[2],nB[3],nB[4],nB[5]*Math.PI*2,nB[6]);
          break;
        case 'R':
          var nLAST = nB.length-1;
          if( nLAST>=5 ) {
            nGCO = nB[nLAST];
          }
          nCT.globalCompositeOperation = nGCO;
          nCT.fillRect(nB[1],nB[2],nB[3],nB[4]);
          break;
        case 'L':
          nCT.lineTo(nB[1],nB[2]);
          break;
        case 'Q':
          nCT.quadraticCurveTo(nB[1],nB[2],nB[3],nB[4]);
          break;
        case 'B':
          nCT.bezierCurveTo(nB[1],nB[2],nB[3],nB[4],nB[5],nB[6]);
          break;
      }
    }
    //最後にべた塗りして完了
    nCT.fill();
    //各パーツのフレーム情報を更新
    var sSCN = ['Color','Trans'];
    for( var s in sSCN ) {
      var nSCN = sSCN[s];
      var nST = mAR[j][nSCN][0];
      if( mAR[j][nSCN][2]>=0 ) {
        //アニメフレームを更新
        if( mAR[j][nSCN][2] == 0 ) {
          mAR[j][nSCN][1]++;//次のフレームへ
        } else {
          mAR[j][nSCN][1] = mAR[j][nSCN][2];//ループ
        }
        var nCF = mAR[j][nSCN][1];
        if( mAID[j][nSCN][nST][nCF] != null ) {
          //カラーorトランスの内容更新
          mAR[j][nSCN][2] =  mAID[j][nSCN][nST][nCF][1];
          mAR[j][nSCN][3] =  mAID[j][nSCN][nST][nCF][0];
        }
      } else {
        allP += mAR[j][nSCN][2];
      }
    }
  }
  //爆発アニメ終了後にdisplayをfalseにする
  if( allP == 0 && nST == ASCENE_EXPL ) {
    this.FLG.display = false;
  }
};
//アニメーションデータ初期化
makeCharaObject.prototype.setAnimationInit = function () {
  var nST = 'init';
  for( var u in this.anime.imgdata ) {
    var nid = this.anime.imgdata[u];
    this.anime.astate[u] = {//現在のシーン名,内部フレーム,ループor停止,描画情報
      'Color':[ nST, 1, nid.Color[nST][1][1], nid.Color[nST][1][0] ],
      'Trans':[ nST, 1, nid.Trans[nST][1][1], nid.Trans[nST][1][0] ]
    };
  }
}
//アニメーションデータ
makeCharaObject.prototype.setAnimationAllSame = function (nST) {
  for( var u in this.anime.imgdata ) {
    var nid = this.anime.imgdata[u];
    if( nid.Color[nST] != null ) {
      this.anime.astate[u].Color = [ nST, 1, nid.Color[nST][1][1], nid.Color[nST][1][0] ];
    }
    if( nid.Trans[nST] != null ) {
      this.anime.astate[u].Trans = [ nST, 1, nid.Trans[nST][1][1], nid.Trans[nST][1][0] ];
    }
  }
}
//■敵情報のセット
//出現タイミングと初期座標など
//[出現フレーム,[表示X座標,表示Y座標],キャラタイプ,ルートタイプ,残弾数,弾タイプ]
var mobAllScript = [
  [10,[-10,40],1,1,3,1],[20,[-10,40],1,1,3,1],[30,[410,160],1,2,3,1],[40,[510,160],1,2,3,1],
  [60,[190,-10],1,3,15,2],[80,[-10,40],1,1,3,2],[90,[410,40],1,1,3,2],[100,[80,-10],1,4,20,2],
  [110,[-10,40],1,1,3,2],[120,[-10,40],1,1,3,1],[130,[280,-10],1,5,20,2],[140,[410,160],1,2,3,2],
  [150,[410,160],1,2,3,1],[200,[-30,80],2,6,100,3]
];
//[動き]、[見た目、HP]
makeCharaObject.prototype.setMobMoveType = function ( mtype ) {
  //[移動方向,フレーム数,発射フラグ]
  switch(mtype) {
    case 1://画面左から出てきて斜めに動いて画面右に消える
      this.movescript = [
        [1,20,0],[3,40,1],[1,100,0]
      ];
      break;
    case 2://画面右から出てきて斜めに動いて画面左に消える
      this.movescript = [
        [9,20,0],[11,40,1],[9,100,0]
      ];
      break;
    case 3://画面上から出てきて静止したあと画面左に消える
      this.movescript = [
        [5,40,0],[17,40,1],[9,100,1]
      ];
      break;
    case 4://画面上から出てきてぐるっと回って左に消える
      this.movescript = [
        [5,40,0],[18,200,1],[16,100,1]
      ];
      break;
    case 5://画面上から出てきてぐるっと回って右に消える
      this.movescript = [
        [5,40,0],[18,200,1],[10,100,1]
      ];
      break;
    case 6://画面左から出てきて左右運動
      this.movescript = [
        [1,60,0],[19,500,1],[1,500,0]
      ];
      break;
    case 7://静止
      this.movescript = [
        [17,600,0]
      ];
      break;
  }
};
function setSpecialMove(mMV,nM) {
  switch(mMV) {
    case 18:
      if(nM.movestate.frame%4 == 0) {
        var nmobF = 1+nM.movestate.frame%16;
        nM.setMobMoveAmount(nmobF);
      }
      break;
    case 19:
      if(nM.movestate.frame%12 == 0) {
        nM.movestate.sframe++;
        var nmobF = 1+nM.movestate.sframe%16;
        nM.setMobMoveAmount(nmobF);
        nM.vector.mY =0;
      }
      break;
    case 20:
      break;
  }
}
//■敵弾情報のセット
function setMobBullet( gXY,gTP ) {
  //登録された弾数を取得
  var gNL = 0;
  for(var r in gun) {
    gNL++;
  }
  var gnV = {1:[0,0],2:[0,-1,1],3:[0,0,-1,1]};
  //個数分だけgunに登録
  for(var g=1;g<=gTP[4];g++) {
    //最後尾に追加
    gun[ gNL ] = new makeCharaObject();
    gun[ gNL ].FLG.alive = true;
    gun[ gNL ].FLG.display = true;
    gun[ gNL ].position.pX = gXY[0];
    gun[ gNL ].position.pY = gXY[1];
    gun[ gNL ].speed = gTP[3]/FPS;
    gun[ gNL ].size = {'w':4,'h':4};
    //弾の移動量の算出
    if( gTP[0]==0 ) {
      //自機と敵キャラとの距離と角度を求めておく
      var gnXY = gun[ gNL ].vectorXY( [mch.position.pX,mch.position.pY] );
      var gnD = gun[ gNL ].vectorDistance( gnXY[0],gnXY[1] );
      if( gTP[4]>1 ) {
        var gnA = gun[ gNL ].vectorAngle( gnXY,gnD );
        //自機に向かって発射
        gnXY = [gnD*Math.cos((gnA+gnV[gTP[4]][g]*gangle)*Math.PI/180)
               ,-gnD*Math.sin((gnA+gnV[gTP[4]][g]*gangle)*Math.PI/180)];
      }
      gun[ gNL ].vectorCals( gnXY,gnD );
    } else {
      //固定方向に向かって発射
      gun[ gNL ].setMobMoveAmount( gTP[0]+gnV[gTP[4]][g] );
    }
    gNL++;
  }
}
//弾丸タイプ選択
var mobBulletType = {//発射方向(0自機、1～16),弾外見,発射間隔,スピード,同時発射数
  1:[5,0,25,60,1],2:[0,0,25,60,1],3:[0,0,20,160,1],4:[0,0,10,160,3],5:[5,0,30,120,3],6:[5,0,20,80,1]
};
//ボスのビット定義
var bossBit = [//弾種類,弾数,外見ナンバー,ボスからの補正座標
  [6,200,3,[-20,20]],[6,200,3,[20,20]],[2,200,1,[-40,10]],[2,200,1,[40,10]]
];
//■begin.getXYMaxMin()：現在の当たり判定領域の算出
function getXYMaxMin( nP,nR ) {
  return {
    'minX' : nP.pX - (nR.w*0.5),
    'maxX' : nP.pX + (nR.w*0.5),
    'minY' : nP.pY - (nR.h*0.5),
    'maxY' : nP.pY + (nR.h*0.5)
  };
}
//end.getXYMaxMin()
