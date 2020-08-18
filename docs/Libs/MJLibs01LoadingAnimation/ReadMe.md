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
