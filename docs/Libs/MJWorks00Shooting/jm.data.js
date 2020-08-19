//*******************************************************************
//�����C�pjavascript
//�@�L������������������
//*******************************************************************
//��makeCharaObject()�F�L���������f�[�^
function makeCharaObject() {
  this.obname = '';//�I�u�W�F�N�g��
  this.position = {'pX':0,'pY':0};//�\�����S���W
  this.vector = {'mX':0,'mY':0};//�ړ��P�ʃx�N�g����
  this.speed = 120/FPS;//1�t���[��������̈ړ��ʒ����l
  this.size = {'w':20,'h':20};//�����蔻��T�C�Y
  this.color = 'rgba(220,180,255,1)';//�I�u�W�F�N�g�̊�{�J���[
  this.bullet = {'num':10,'style':[]};//�c�e��
  this.FLG = {'alive':true,'display':false};//��ԃt���O
  this.score = [0,0];
  this.movescript = [];//�ړ��O���f�[�^�Q
  this.movestate = {//�ړ���ԂɊւ���f�[�^
    'state':0,//�ړ��X�N���v�g�i���o�[
    'dframe':0,//�\���J�n�t���[��
    'frame':0,//�����J�E���g�t���[��
    'sframe':0,//�����J�E���g�⏕�t���[��
    'maxFrame':0,//�s���؂�ւ��^�C�~���O�t���[��
    'HP':0//HP�A�[���ɂȂ����玀�S
  };
  this.anime = {
    'asize' : {'w':0,'h':0},//�`��͈̓T�C�Y
    'astate' : {},//���݂�transform���
    'imgdata' : []//���f�[�^
  };
}
//���W�̍X�V
makeCharaObject.prototype.movePosition = function () {
  this.position.pX += this.vector.mX * this.speed;
  this.position.pY += this.vector.mY * this.speed;
};
//�͈͂ɂ��`��t���O����
makeCharaObject.prototype.judgeField = function () {
  var szW = this.size.w*0.5;
  var szH = this.size.h*0.5;
  //�`��͈͂̔���
  if( this.position.pX < -szW || this.position.pX > (cBOX.w+szW) ||
      this.position.pY < -szH || this.position.pY > (cBOX.h+szH)) {
    this.FLG.display = false;
  } else {
    if(this.FLG.alive && !this.FLG.display) {
      this.FLG.display = true;
    }
  }
};
//�����蔻��
makeCharaObject.prototype.judgeBump = function (mR) {
  var myMM = getXYMaxMin(this.position,this.size);
  for( var k in mR ) {
    if( mR[k].FLG.alive == true ) {
      //�݂��͈̔͂��瓖���蔻��
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
        //���@����Ȃ���΃q�b�g�X�R�A���Z
        if(this.obname!=OBNAME_MY) {
          nscore+=this.score[0];
        }
        //�{�Xor���@�ɒ��e���̉��o
        if( this.obname==OBNAME_ENEMY[2] || this.obname==OBNAME_MY ) {
          this.setAnimationAllSame(ASCENE_HIT+this.movestate.HP);
        }
        //�{�X��HP�������ȉ��Œe�^�C�v�ύX
        if( this.obname==OBNAME_ENEMY[2] && this.movestate.HP<=10 ) {
          this.bullet.style = mobBulletType[ 4 ];
        }
        //HP�O�̂Ƃ��̏���
        if( this.movestate.HP <= 0 && this.FLG.alive ) {
          //���@����Ȃ���Δj��X�R�A���Z
          if(this.obname!=OBNAME_MY) nscore+=this.score[1];
          this.FLG.alive = false;
          //�e�p�[�c��color��transform���X�V
          this.setAnimationAllSame(ASCENE_EXPL);
          //�{�X�̎��̓r�b�g���ꏏ�ɔ���
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
        //�e��alive��false
        mR[k].FLG.alive = false;
      }
    }
  }
};
//���@�Ɍ������P�ʃx�N�g���Z�o
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
//16������1�t���[��������̈ړ��ʂ��Z�o
makeCharaObject.prototype.setMobMoveAmount = function (mMV) {
  var baseAngle = 22.5;
  var rad = baseAngle * (mMV-1) * Math.PI / 180;
  var zero = (mMV%17)/mMV;//17�̎���0�A����ȊO��1
  //�����_4���܂łɒl���ۂ߂�
  var sx = zero*Math.floor(Math.cos(rad)*10000)*0.0001;
  var sy = zero*Math.floor(Math.sin(rad)*10000)*0.0001;
  this.vector.mX = sx;
  this.vector.mY = sy;
};
//end.makeCharaObject()
//���`��canvas��draw���ăA�j���t���[�����X�V
makeCharaObject.prototype.characterDraw = function () {
  var nCT = ct[G_CANVAS_NAME];
  var mASZ = this.anime.asize;
  var mAR = this.anime.astate;
  var mAID = this.anime.imgdata;
  var allP = 0;
  var nPX = this.position.pX - mASZ.w*0.5;
  var nPY = this.position.pY - mASZ.h*0.5;
  //�e�p�[�c���Ƃɏ���
  for( var j in mAR ) {
    allP+=2;
    //�e�p�[�c�̃x�W�G�f�[�^�E�J���[���E�g�����X�t�H�[�������擾
    var nCOL = mAR[j].Color[3];
    var nTRN = mAR[j].Trans[3];
    var nBZR = mAID[j].Bezier;
    //globalCompositeOperation�̐ݒ�
    var nGCO = 'source-over';//�����l��source-over
    //�`��
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
    //�Ō�ɂׂ��h�肵�Ċ���
    nCT.fill();
    //�e�p�[�c�̃t���[�������X�V
    var sSCN = ['Color','Trans'];
    for( var s in sSCN ) {
      var nSCN = sSCN[s];
      var nST = mAR[j][nSCN][0];
      if( mAR[j][nSCN][2]>=0 ) {
        //�A�j���t���[�����X�V
        if( mAR[j][nSCN][2] == 0 ) {
          mAR[j][nSCN][1]++;//���̃t���[����
        } else {
          mAR[j][nSCN][1] = mAR[j][nSCN][2];//���[�v
        }
        var nCF = mAR[j][nSCN][1];
        if( mAID[j][nSCN][nST][nCF] != null ) {
          //�J���[or�g�����X�̓��e�X�V
          mAR[j][nSCN][2] =  mAID[j][nSCN][nST][nCF][1];
          mAR[j][nSCN][3] =  mAID[j][nSCN][nST][nCF][0];
        }
      } else {
        allP += mAR[j][nSCN][2];
      }
    }
  }
  //�����A�j���I�����display��false�ɂ���
  if( allP == 0 && nST == ASCENE_EXPL ) {
    this.FLG.display = false;
  }
};
//�A�j���[�V�����f�[�^������
makeCharaObject.prototype.setAnimationInit = function () {
  var nST = 'init';
  for( var u in this.anime.imgdata ) {
    var nid = this.anime.imgdata[u];
    this.anime.astate[u] = {//���݂̃V�[����,�����t���[��,���[�vor��~,�`����
      'Color':[ nST, 1, nid.Color[nST][1][1], nid.Color[nST][1][0] ],
      'Trans':[ nST, 1, nid.Trans[nST][1][1], nid.Trans[nST][1][0] ]
    };
  }
}
//�A�j���[�V�����f�[�^
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
//���G���̃Z�b�g
//�o���^�C�~���O�Ə������W�Ȃ�
//[�o���t���[��,[�\��X���W,�\��Y���W],�L�����^�C�v,���[�g�^�C�v,�c�e��,�e�^�C�v]
var mobAllScript = [
  [10,[-10,40],1,1,3,1],[20,[-10,40],1,1,3,1],[30,[410,160],1,2,3,1],[40,[510,160],1,2,3,1],
  [60,[190,-10],1,3,15,2],[80,[-10,40],1,1,3,2],[90,[410,40],1,1,3,2],[100,[80,-10],1,4,20,2],
  [110,[-10,40],1,1,3,2],[120,[-10,40],1,1,3,1],[130,[280,-10],1,5,20,2],[140,[410,160],1,2,3,2],
  [150,[410,160],1,2,3,1],[200,[-30,80],2,6,100,3]
];
//[����]�A[�����ځAHP]
makeCharaObject.prototype.setMobMoveType = function ( mtype ) {
  //[�ړ�����,�t���[����,���˃t���O]
  switch(mtype) {
    case 1://��ʍ�����o�Ă��Ď΂߂ɓ����ĉ�ʉE�ɏ�����
      this.movescript = [
        [1,20,0],[3,40,1],[1,100,0]
      ];
      break;
    case 2://��ʉE����o�Ă��Ď΂߂ɓ����ĉ�ʍ��ɏ�����
      this.movescript = [
        [9,20,0],[11,40,1],[9,100,0]
      ];
      break;
    case 3://��ʏォ��o�Ă��ĐÎ~�������Ɖ�ʍ��ɏ�����
      this.movescript = [
        [5,40,0],[17,40,1],[9,100,1]
      ];
      break;
    case 4://��ʏォ��o�Ă��Ă�����Ɖ���č��ɏ�����
      this.movescript = [
        [5,40,0],[18,200,1],[16,100,1]
      ];
      break;
    case 5://��ʏォ��o�Ă��Ă�����Ɖ���ĉE�ɏ�����
      this.movescript = [
        [5,40,0],[18,200,1],[10,100,1]
      ];
      break;
    case 6://��ʍ�����o�Ă��č��E�^��
      this.movescript = [
        [1,60,0],[19,500,1],[1,500,0]
      ];
      break;
    case 7://�Î~
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
//���G�e���̃Z�b�g
function setMobBullet( gXY,gTP ) {
  //�o�^���ꂽ�e�����擾
  var gNL = 0;
  for(var r in gun) {
    gNL++;
  }
  var gnV = {1:[0,0],2:[0,-1,1],3:[0,0,-1,1]};
  //��������gun�ɓo�^
  for(var g=1;g<=gTP[4];g++) {
    //�Ō���ɒǉ�
    gun[ gNL ] = new makeCharaObject();
    gun[ gNL ].FLG.alive = true;
    gun[ gNL ].FLG.display = true;
    gun[ gNL ].position.pX = gXY[0];
    gun[ gNL ].position.pY = gXY[1];
    gun[ gNL ].speed = gTP[3]/FPS;
    gun[ gNL ].size = {'w':4,'h':4};
    //�e�̈ړ��ʂ̎Z�o
    if( gTP[0]==0 ) {
      //���@�ƓG�L�����Ƃ̋����Ɗp�x�����߂Ă���
      var gnXY = gun[ gNL ].vectorXY( [mch.position.pX,mch.position.pY] );
      var gnD = gun[ gNL ].vectorDistance( gnXY[0],gnXY[1] );
      if( gTP[4]>1 ) {
        var gnA = gun[ gNL ].vectorAngle( gnXY,gnD );
        //���@�Ɍ������Ĕ���
        gnXY = [gnD*Math.cos((gnA+gnV[gTP[4]][g]*gangle)*Math.PI/180)
               ,-gnD*Math.sin((gnA+gnV[gTP[4]][g]*gangle)*Math.PI/180)];
      }
      gun[ gNL ].vectorCals( gnXY,gnD );
    } else {
      //�Œ�����Ɍ������Ĕ���
      gun[ gNL ].setMobMoveAmount( gTP[0]+gnV[gTP[4]][g] );
    }
    gNL++;
  }
}
//�e�ۃ^�C�v�I��
var mobBulletType = {//���˕���(0���@�A1�`16),�e�O��,���ˊԊu,�X�s�[�h,�������ː�
  1:[5,0,25,60,1],2:[0,0,25,60,1],3:[0,0,20,160,1],4:[0,0,10,160,3],5:[5,0,30,120,3],6:[5,0,20,80,1]
};
//�{�X�̃r�b�g��`
var bossBit = [//�e���,�e��,�O���i���o�[,�{�X����̕␳���W
  [6,200,3,[-20,20]],[6,200,3,[20,20]],[2,200,1,[-40,10]],[2,200,1,[40,10]]
];
//��begin.getXYMaxMin()�F���݂̓����蔻��̈�̎Z�o
function getXYMaxMin( nP,nR ) {
  return {
    'minX' : nP.pX - (nR.w*0.5),
    'maxX' : nP.pX + (nR.w*0.5),
    'minY' : nP.pY - (nR.h*0.5),
    'maxY' : nP.pY + (nR.h*0.5)
  };
}
//end.getXYMaxMin()
