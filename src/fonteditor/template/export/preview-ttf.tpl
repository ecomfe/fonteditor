<style>{%=previewCss%}</style>
<style>
    @font-face {
        font-family: '{%=fontFamily%}';
        {%if(fontFormat=='eot'){%}
        src: url({%=fontData%});
        {%} else if(fontFormat=='ttf') {%}
        src: url({%=fontData%}) format('truetype');
        {%} else {%}
        src: url({%=fontData%}) format('{%=fontFormat%}');
        {%}%}
    }
    .icon {
        font-family: '{%=fontFamily%}';
    }
</style>
<div class="main">
    <h1>预览{%=fontFormat%}格式字体</h1>
    <ul class="icon-list">
        {%glyfList.forEach(function(glyf) {%}
        <li>
            <i class="icon">{%=glyf.code%}</i>
            <div class="code">{%=glyf.codeName%}</div>
            <div class="name">{%=glyf.name%}</div>
        </li>
        {%});%}
    </ul>
    <div class="helps">第一步：使用font-face声明字体
<pre>
@font-face {
    font-family: '{%=fontFamily%}';
    src: url('{%=fontFamily%}.eot'); /* IE9*/
    src: url('{%=fontFamily%}.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
    url('{%=fontFamily%}.woff') format('woff'), /* chrome、firefox */
    url('{%=fontFamily%}.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
    url('{%=fontFamily%}.svg#ux{%=fontFamily%}') format('svg'); /* iOS 4.1- */
}
</pre>
第二步：定义使用{%=fontFamily%}的样式
<pre>
.{%=fontFamily%} {
    font-family:"{%=fontFamily%}" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
</pre>
第三步：挑选相应图标并获取字体编码，应用于页面
<pre>
    &lt;i class="{%=fontFamily%}"&gt;&amp;#x33&lt;/i&gt;
</pre>
</div>
</div>
