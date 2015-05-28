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
    <h1>${lang.preview_title}</h1>
    <ul class="icon-list">
        {%glyfList.forEach(function(glyf) {%}
        <li>
            <i class="icon">{%=glyf.code%}</i>
            <div class="code">{%=glyf.codeName%}</div>
            <div class="name">{%=glyf.name%}</div>
        </li>
        {%});%}
    </ul>
    <div class="helps">${lang.preview_first_step}
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
${lang.preview_second_step}
<pre>
.{%=fontFamily%} {
    font-family:"{%=fontFamily%}" !important;
    font-size:16px;font-style:normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    -moz-osx-font-smoothing: grayscale;
}
</pre>
${lang.preview_third_step}
<pre>
    &lt;i class="{%=fontFamily%}"&gt;&amp;#x33&lt;/i&gt;
</pre>
</div>
</div>
