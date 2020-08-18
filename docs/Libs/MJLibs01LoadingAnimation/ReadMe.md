# ローディングアニメーションの実装方法

## １．htmlファイルの<script>タグを使った実装方法
    <head>
      <script type="text/javascript" src="MJLibs01LoadingAnimation.js"></script>
      <script type="text/javascript">
        var ld = new MJLibs01LoadingAnimation({});
      </script>
    </head>
    <body>
      <button onclick="ld.Start()">再生</button>
      <button onclick="ld.Stop()">停止</button>
    </body>
外部スクリプトとして「MJLibs01LoadingAnimation.js」を読み込みます。  
「MJLibs01LoadingAnimation」メソッドをnewで変数の中にインスタンス化して格納します。  
 
あとはbuttonタグにonclickを設置し、インスタンスから「Start」メソッドおよび「Stop」メソッドを呼び出すだけです。 
 
上記の例では、「再生」ボタンを押すとアニメーションが始まり、「停止」ボタンを押すとアニメーションが終了します。
