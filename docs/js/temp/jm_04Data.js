/*==============================================================================
  ■JMPrivate_Data：Dataクラス
================================================================================*/
var JMPrivate_Data = (function() {

  //■【メンバ変数】
  const _This = "_Private";
//  var _Main, _Methods, _Button, _Parts, _Config, _Global, _Private, _Inherent, _Test;

  //■【コンストラクタ】
  var JMPrivate_Data = function(param) {
  };
  var PT = JMPrivate_Data.prototype;

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■キャラ
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //▼キャラ001
  PT.Charactor_001 = function() {
    return {
      Attack:1000, Defence:1000, HitPoint:5000,
      Element:{ Light:1, Dark:1, Fire:1, Wind:1, Earth:1, Water:1 },
      Race:"Human", Killer:"Goblin"
    };
  };

  //▼キャラ002
  PT.Charactor_002 = function() {
    return {
      Attack:1500, Defence:500, HitPoint:1000,
      Element:{ Light:1, Dark:1, Fire:1, Wind:1, Earth:1, Water:1 },
      Race:"Human", Killer:"Human"
    };
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■武器
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //▼剣
  PT.WeponAtSword = function() {
    return {
      Attack:200, Defence:-10, HitPoint:0,
      Element:{ Light:0, Dark:0, Fire:0.2, Wind:0, Earth:0, Water:0 },
      Race:null, Killer:"Human"
    };
  };
  //▼槍
  PT.WeponAtSpear = function() {
    return {
      Attack:220, Defence:-10, HitPoint:0,
      Element:{ Light:0, Dark:0, Fire:0.2, Wind:0, Earth:0, Water:0 },
      Race:null, Killer:"Human"
    };
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■防具
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //▼鎧
  PT.Armer = function() {
    return {
      Attack:-10, Defence:50, HitPoint:0,
      Element:{ Light:0, Dark:0, Fire:0, Wind:0, Earth:0, Water:0 },
      Race:null, Killer:null
    };
  };

  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  //■【return】
  //++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  return JMPrivate_Data;
})();

