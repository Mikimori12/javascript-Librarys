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
色見や背景色など、設定をいじれるようにしています。  
インスタンス化する時に初期値を付与してください。  
未設定（null）の場合は初期値が反映されます。

| 引数 | 初期値 | 補足 |
----|----
| Z | 9999 | ローディングアニメーションのz-index値 |
