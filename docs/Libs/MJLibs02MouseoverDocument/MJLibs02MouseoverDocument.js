/*==============================================================================
  ■MJLibs02MouseoverDocument：マウスオーバードキュメントライブラリ
================================================================================*/
var MJLibs02MouseoverDocument = (function() {

  //■【メンバ変数】
  var _HelpDoc, _HelpDocZIndex, _HelpDocXY, _HelpFLG;

  //■【コンストラクタ】
  var MJLibs02MouseoverDocument = function(param) {
    //▼設定
    _HelpDoc = this;
    _HelpDocXY = {};//ヘルプドキュメントを表示する座標
    _HelpDocZIndex = param.ZIndex || 9990;//ヘルプドキュメントのz-index値
    _HelpFLG = true;
    //▼起動
    _HelpDoc.RunHelpdocumentLibrary();
  };
  var PT = MJLibs02MouseoverDocument.prototype;

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■共通
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //▼ヘルプドキュメントの設置
  PT.RunHelpdocumentLibrary = function() {
    //ヘルプドキュメントの取得
    var help = document.querySelectorAll('[data-helpid]');
    if( help.length == 0 ) {
      return;
    }
    //
    for( var h=0;h<help.length;h++ ) {
      var nHELP = help[h];
      var helpid = nHELP.dataset.helpid;
      //ドキュメントDOMを最下部に移動
      var doc = document.querySelector('[data-helpdoc="'+helpid+'"]');
      doc.parentNode.removeChild(doc);
      document.body.appendChild(doc);
      doc.style.zIndex = _HelpDocZIndex;
      doc.style.position = 'fixed'
      //表示座標を取得
      _HelpDocXY[ helpid ] = _HelpDoc.GetXY({Switch:nHELP, Doc:doc});
      doc.style.display = 'none'
      //マウスオーバーイベント実装
      nHELP.addEventListener('mouseover', _HelpDoc.ShowHelpDocument, false);
      nHELP.addEventListener('mouseout', _HelpDoc.CloseHelpDocument, false);
      nHELP.addEventListener('touchend', _HelpDoc.CloseHelpDocument, false);
    }
  };

  //▼ヘルプドキュメント表示
  PT.ShowHelpDocument = function(param) {
    if(_HelpFLG) {
      _HelpFLG = false;
      var helpid = _HelpDoc.GetHelpID(param.target);
      var doc = document.querySelector('[data-helpdoc="'+helpid+'"]');
      doc.style.top = _HelpDocXY[helpid].Top;
      doc.style.left = _HelpDocXY[helpid].Left;
      doc.style.display = 'block';
    }
  };
  //▼ヘルプドキュメント閉じる
  PT.CloseHelpDocument = function(param) {
    if(!_HelpFLG) {
      _HelpFLG = true;
      var helpid = _HelpDoc.GetHelpID(param.target);
      var doc = document.querySelector('[data-helpdoc="'+helpid+'"]');
      doc.style.display = 'none';
    }
  };
  //▼クリックで表示非表示
  PT.ClickHelpDocument = function(param) {
    if(_HelpFLG) {
      _HelpDoc.ShowHelpDocument(param);
    } else {
      _HelpDoc.CloseHelpDocument(param);
    }
  };

  //▼helpidを取得する（再起処理あり）
  PT.GetHelpID = function(param) {
    var dom = param;
    var helpid = "";
    if( dom.dataset.helpid == null ) {
      helpid = _HelpDoc.GetHelpID(dom.parentNode);
    } else {
      helpid = dom.dataset.helpid;
    }
    return helpid;
  };

  //▼表示座標の取得
  PT.GetXY = function(param) {
    var domXY = param.Switch.getBoundingClientRect();
    var docWH = param.Doc.getBoundingClientRect();
    var browsWid = window.innerWidth;
    var browsHei = window.innerHeight;
    var x = 0, y = 0;
    var padding = 8;
    //ブラウザの左サイドか右サイドか
    if( domXY.left <= browsWid*0.5 ) {
      //左
      x = domXY.right + padding;
    } else {
      //右
      x = domXY.left - ( docWH.width + padding);
    }
    //ブラウザの上端か下端か
    if( (browsHei - domXY.bottom) > docWH.height ) {
      //下端より上
      y = domXY.top;
    } else {
      //下
      y = domXY.bottom - docWH.height;
    }
    return {Left:x+'px', Top:y+'px'};
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【return】
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  return MJLibs02MouseoverDocument;
})();

