# ローディングアニメーションの実装方法

## １．htmlファイルの<script>タグを使った実装方法

    <head>
      <script type="text/javascript" src="MJLibs01LoadingAnimation.js"></script>
      <script type="text/javascript">
        var lda = new MJLibs01LoadingAnimation({});
      </script>
    </head>
    <body>
      <button onclick="lda.Start()">再生</button>
      <button onclick="lda.Stop()">停止</button>
    </body>

外部スクリプトとして「MJLibs01LoadingAnimation.js」を読み込みます。  
「MJLibs01LoadingAnimation」メソッドをnewで変数の中にインスタンス化して格納します。  
 
あとはbuttonタグにonclickを設置し、インスタンスから「Start」メソッドおよび「Stop」メソッドを呼び出すだけです。 
 
上記の例では、「再生」ボタンを押すとアニメーションが始まり、「停止」ボタンを押すとアニメーションが終了します。

## ２．別の外部javascriptで実装
htmlファイルに外部スクリプトとして読み込みます。  

    <!-- htmlファイル -->
    <script type="text/javascript" src="MJLibs01LoadingAnimation.js"></script>

別の外部スクリプト内で、同じように「MJLibs01LoadingAnimation」メソッドをインスタンス化します。

    //外部javascript内
    var lda = new MJLibs01LoadingAnimation({});
    ：
    //何かの処理の前にアニメーション開始
    lda.Start();
    ：
    //処理の終了時にアニメーション停止
    lda.Stop();
    
XMLHttpRequestでサーバにアクセスする時などに使っています。

# 設定できる項目
ボール色や背景色など、設定をいじれるようにしています。  
インスタンス化する時に初期値を付与してください。  
未設定（null）の場合は初期値が反映されます。

| 引数 | 型 | 初期値 | 補足 |
----|----|----|----
| Method | string | "CirclingBall" | 再生したいローディングアニメーションの指定。 |
| RGB | 連想配列 | { R:0, G:120, B:255 } | ローディングアニメーションの色。RGB値を0～255で指定。 |
| Back | string | "rgba(0,0,0,0.1)" | ローディングアニメーションの背景色。cssで指定するカラー値「#fff」「#f0f0f0」「white」などであればOK。 |
| R | int | 6 | ボールの半径。 |
| Wid | int | 100 | ローディングアニメーションの幅と高さの値。正方形になります。 |
| Timing | int | 100 | ローディングアニメーションの再生間隔。初期値は100ミリ秒。 |
| Z | int | 9999 | ローディングアニメーションのz-index値。 |
| Name | string | "LoadingAnimationLibrary" | ローディングアニメーションのcanvas名。カスタムデータ属性「data-library」に設定される値です。 |

