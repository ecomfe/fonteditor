/**
 * @file icon.css
 */

@font-face {
    font-family: "{%=fontFamily%}";
    src: url("{%=fontFamily%}.eot"); /* IE9 */
    src: url("{%=fontFamily%}.eot?#iefix") format("embedded-opentype"), /* IE6-IE8 */
    url("{%=fontFamily%}.woff2") format("woff2"), /* chrome、firefox、opera、Safari, Android, iOS */
    url("{%=fontFamily%}.woff") format("woff"), /* chrome、firefox */
    url("{%=fontFamily%}.ttf") format("truetype"), /* chrome、firefox、opera、Safari, Android, iOS 4.2+ */
    url("{%=fontFamily%}.svg#uxfonteditor") format("svg"); /* iOS 4.1- */
}


.{%=iconPrefix%} {
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

{% _.each(glyfList, function(glyf) { %}
.icon-{%=glyf.name%}:before {
  content: "{%=glyf.codeName%}";
}
{% }); %}


