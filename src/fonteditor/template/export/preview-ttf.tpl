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
    <ul class="iconfont-list">
        {%glyphList.forEach(function(glyph) {%}
        <li>
            <i class="icon">{%=glyph.code%}</i>
            <div class="code">{%=glyph.codeName%}</div>
            <div class="name">{%=glyph.name%}</div>
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
    font-family: "{%=fontFamily%}" !important;
    speak: none;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.icon-tree:after {content: '\33';}
</pre>
${lang.preview_third_step}
<pre>
    &lt;i class="{%=fontFamily%}"&gt;&amp;#x33&lt;/i&gt;

or

    &lt;i class="{%=fontFamily%} icon-three"&gt;&lt;/i&gt;
</pre>
</div>
</div>
