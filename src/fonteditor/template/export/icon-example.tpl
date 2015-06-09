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
            {%_.each(glyfList, function(glyf) {%}
            <li>
            <i class="icon icon-{%=glyf.name%}"></i>
                <div class="code">{%=glyf.codeName%}</div>
                <div class="name">{%=glyf.name%}</div>
            </li>
            {%});%}
        </ul>
    </div>

</body>
</html>
