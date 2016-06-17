<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>symbol example</title>
    <link rel="stylesheet" href="./page.css">
    <style>
        .iconfont-list .icon {
            width: 42px;
            height: 42px;
            transform: scale(1);
            -webkit-transition: transform .25s ease-out 0s;
            transition: transform .25s ease-out 0s;
        }
        .iconfont-list .icon:hover {
            transform: scale(1.5);
        }
    </style>
</head>
<body>

{%=symbolText%}
    <div class="main">
        <h1>{%=fontFamily%} symbol example</h1>
        <ul class="iconfont-list">
            {%_.each(glyfList, function(glyf) {%}
            <li>
                <svg class="icon"><use xlink:href="#{%=glyf.id%}"/></svg>
                <div class="code">symbol</div>
                <div class="name">{%=glyf.id%}</div>
            </li>
            {%});%}
        </ul>
    </div>
</body>
</html>
