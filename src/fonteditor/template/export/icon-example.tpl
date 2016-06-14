<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>icon example</title>
    <link rel="stylesheet" href="./page.css">
    <link rel="stylesheet" href="./icon.css">
</head>
<body>
    <div class="main">
        <h1>{%=fontFamily%} example</h1>
        <ul class="iconfont-list">
            {%_.each(glyphList, function(glyph) {%}
            <li>
            <i class="icon icon-{%=glyph.name%}"></i>
                <div class="code">{%=glyph.codeName%}</div>
                <div class="name">{%=glyph.name%}</div>
            </li>
            {%});%}
        </ul>
    </div>

</body>
</html>
