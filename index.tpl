<!DOCTYPE html>
<html lang="${lang.lang}">
<head>
    <meta charset="UTF-8">
    <title>FontEditor</title>
    <link rel="stylesheet" type="text/css" href="./dep/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="./css/main.css">
</head>
<body>

    <section class="navbar" role="navigation">
        <div class="logo"></div>
        <div class="action-groups btn-groups">

            <button data-action="add-new" type="button" class="btn btn-flat btn-new btn-sm"><i class="ico ico-left i-add"></i>${lang.newglyph}</button>
            <i class="split"></i>

            <button data-action="undo" type="button" class="btn btn-flat btn-ico" title="${lang.undo}"><i class="ico i-undo"></i></button>
            <button data-action="redo" type="button" class="btn btn-flat btn-ico" title="${lang.redo}"><i class="ico i-redo"></i></button>
            <i class="split"></i>

            <div class="btn-group">
                <button type="button" class="btn btn-flat btn-sm dropdown-toggle" data-toggle="dropdown">
                    ${lang.import}
                    <span class="ico i-down"></span>
                </button>
                <ul class="dropdown-menu" role="menu">
                    <li data-action="import"  title="${lang.import_svg_title}"><a>${lang.import_svg}</a></li>
                    <li data-action="import-pic"  title="${lang.import_pic_title}"><a>${lang.import_pic}</a></li>
                    <li data-action="import"  title="${lang.import_font_title}"><a>${lang.import_font}</a></li>
                    <li data-action="add-online"><a>${lang.onlinefont}</a></li>
                    <li data-action="add-url"><a>${lang.fonturl}</a></li>
                </ul>
            </div>
            <i class="split"></i>

            <a id="export-btn" href="#" data-action="export" data-type="ttf" class="btn btn-flat btn-ico" title="${lang.export_ttf}"><i class="ico i-ttf"></i></a>
            <a id="export-btn-woff" href="#" data-action="export" data-type="woff" class="btn btn-flat btn-ico" title="${lang.export_woff}"><i class="ico i-woff"></i></a>
            <a id="export-btn-zip" href="#" data-action="export" data-type="zip" class="btn btn-flat btn-ico" title="${lang.export_zip}"><i class="ico i-zip"></i></a>
            <i class="split"></i>

            <button data-action="save" type="button" class="btn btn-flat btn-sm"><i class="ico ico-left i-save"></i>${lang.save_proj}</button>

            <div class="btn-group">
                <button type="button" class="btn btn-flat btn-sm dropdown-toggle" data-toggle="dropdown">
                    ${lang.tool}
                    <span class="drop ico i-down"></span>
                </button>
                <ul class="dropdown-menu" role="menu">
                    <li><a data-action="setting-glyf-name">${lang.gen_glyph_name}</a></li>
                    <li><a data-action="setting-glyf-clearname">${lang.clear_glyph_name}</a></li>
                    <li><a data-action="setting-optimize">${lang.optimize_glyph}</a></li>
                    <li><a data-action="setting-compound2simple">${lang.compound2simple}</a></li>
                </ul>
            </div>

            <div class="btn-group">

                <button type="button" class="btn btn-flat btn-sm dropdown-toggle" data-toggle="dropdown">
                    ${lang.setting}
                    <span class="drop ico i-down"></span>
                </button>

                <ul class="dropdown-menu" role="menu">
                    <li><a data-action="setting-name">${lang.fontinfo}</a></li>
                    <li><a data-action="setting-metrics">${lang.metrics}</a></li>
                    <li><a data-action="setting-editor">${lang.editor_setting}</a></li>
                    <li><a data-action="setting-import-and-export">${lang.import_and_export}</a></li>
                </ul>
            </div>

            <i class="split"></i>

            <div class="btn-group">

                <button type="button" class="btn btn-flat btn-preview btn-sm dropdown-toggle" data-toggle="dropdown">
                    ${lang.preview}
                    <span class="drop ico i-down"></span>
                </button>

                <ul class="dropdown-menu" role="menu">
                    <li><a data-format="ttf" data-action="preview">${lang.preview_ttf}</a></li>
                    <li><a data-format="woff" data-action="preview">${lang.preview_woff}</a></li>
                    <li><a data-format="svg" data-action="preview">${lang.preview_svg}</a></li>
                    <li><a data-format="eot" data-action="preview">${lang.preview_eot}</a></li>
                </ul>
            </div>
        </div>

        <div class="switch-lang">
            <a href="./index.html">中文</a> |
            <a href="./index-en.html">English</a>
        </div>
        <a class="ico i-github forkme" href="https://github.com/ecomfe/fonteditor" target="_blank">Fork me on Github</a>
        <a class="ico i-help userguide" href="./doc/index.html" target="_blank">${lang.help}</a>
    </section>

    <section class="sidebar">
        <div class="project-btns action-groups">
            <button data-action="new" type="button" class="btn btn-flat btn-sm" title="${lang.new_font_title}"><i class="ico ico-left i-new"></i>${lang.new_font}</button><button data-action="open" type="button" class="btn btn-flat btn-sm" title="${lang.open_font_title}"><i class="ico ico-left i-open"></i>${lang.open_font}</button>
        </div>
        <div class="project">
            <div class="project-title">${lang.project_list}</div>
            <div id="project-list" class="project-list"></div>
        </div>
    </section>

    <section class="main">
        <ul id="glyf-list-commandmenu" class="command-groups"></ul>
        <div id="glyf-list-pager" class="pager"></div>
        <div id="glyf-list" class="glyf-list"></div>
    </section>

    <section class="editor">
        <ul id="editor-commandmenu" class="command-groups"></ul>
        <i class="ico i-leave close-editor" title="${lang.close_editor}"></i>
        <div id="glyf-editor" class="glyf-editor" oncontextMenu="return false"></div>
    </section>


    <div class="modal" id="model-dialog" tabindex="-1" role="dialog" aria-labelledby="model-label" aria-hidden="true" data-backdrop="false">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">关闭</span></button>
            <h4 class="modal-title" id="model-label">${lang.setting}</h4>
          </div>
          <div class="modal-body"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-flat btn-sm" data-dismiss="modal">${lang.cancel}</button>
            <button type="button" class="btn btn-flat btn-sm btn-confirm">${lang.confirm}</button>
          </div>
        </div>
      </div>
    </div>


    <div id="selection-range" class="selection-range"></div>
    <div id="loading" class="loading"><span>${lang.msg_loading}</span></div>


    <form id="font-form" style="width:0px;height:0px;overflow:hidden;"><input id="font-import" type="file" multiple="multiple"></form>
    <iframe id="sync-frame" name="sync-frame" width="0" height="0" frameborder="0" style="display:none;"></iframe>
    <script src="./dep/esl.js"></script>
    <script src="./dep/jquery.min.js"></script>
    <script src="./dep/bootstrap/js/bootstrap.min.js"></script>
    <script src="./dep/clipper.js"></script>
    <script src="./dep/hidpi-canvas.js"></script>
    <script>
        window.language = '${lang.lang}';
        require.config({
            baseUrl: './src',
            packages: [
                {
                    name: 'fonteditor-core',
                    location: '../dep/fonteditor-core/src'
                }
            ],
            paths: {
                utpl: '../dep/utpl.min',
                JSZip: '../dep/jszip/jszip.min',
                inflate: '../dep/pako_inflate.min',
                deflate: '../dep/pako_deflate.min'
            }
        });
        define('jquery', window.jQuery);
        define('ClipperLib', window.ClipperLib);
        require(['fonteditor/main'])
    </script>

    <script>
    var _hmt = _hmt || [];
    /baidu.com$/.test(location.hostname) && (function() {
      var hm = document.createElement("script");
      hm.src = "//hm.baidu.com/hm.js?65ce30cdeda584c416e39648915689f7";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();
    </script>
</body>
</html>
