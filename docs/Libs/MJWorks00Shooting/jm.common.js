//*******************************************************************
//�����C�pjavascript
//�@jm.common
//�@�g���񂵂̗����ėp�I�ŏ����Ȋ֐����܂Ƃ߂�
//*******************************************************************
//��timeout�ɂ��J��Ԃ������֐�
var FPS = 30;//���b�̃t���[����
var ToFrame = 1000 / FPS;//setTimeout�w��l
var gSec = 25;//�Q�[���v���C�������ԁ@�b
var maxFrame = gSec * FPS;//�ő�t���[����
var mFrame = 1;//����t���[�������l
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
//��begin.makeCanvas()�Fcanvas�̍쐬
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
//��begin.timeDOM()�F���݂̃^�C���X�^���v�̎擾�ƕ\��
function timeDOM ( jmTime,sTime,comment ) {
  var gT = (( new Date().getTime() - sTime )*0.001).toFixed(1);
  document.all[jmTime].innerText = gT+comment;
}
//end.timeDOM()

