# ローディングアニメーションの実装方法

## １．htmlファイルの<script>タグを使った実装方法
    <script type="text/javascript">
      var ld = new MJLibs01LoadingAnimation({});
    </script>
    <button onclick="ld.Start()">再生</button>
    <button onclick="ld.Stop()">停止</button>
