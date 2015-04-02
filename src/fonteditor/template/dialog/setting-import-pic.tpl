<div id="import-pic-dialog">
    <div class="form-group">
        <div class="input-group btn-right">
            <button type="button" data-action="fitwindow" class="btn btn-flat btn-new btn-sm">适应窗口</button>&nbsp;
            <button type="button" data-action="fitwindow-left" class="btn btn-flat btn-new btn-sm">查看原图</button>&nbsp;
            <button type="button" data-action="fitwindow-right" class="btn btn-flat btn-new btn-sm">查看轮廓</button>
        </div>
        <button data-action="openfile" type="button" class="btn btn-flat btn-new btn-sm">选择图片</button>
        <span>请选择字形图片，支持jpg|gif|png。</span>
        <form id="import-pic-form" style="width:0px;height:0px;overflow:hidden;"><input id="import-pic-file" type="file"></form>
    </div>
    <div class="preview-panel"><div class="canvas-left"><canvas id="import-pic-canvas-origin"></canvas></div><div class="canvas-right"><canvas id="import-pic-canvas-fit"></canvas></div></div>
    <div class="form-inline">
        <button type="button" data-filter="restore" class="btn btn-flat btn-sm btn-right">恢复</button>
        <span class="form-title">预处理：</span>
        <div class="form-group">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">反转</span>
                <span class="form-control"><input data-filter="reverse" type="checkbox"></span>
            </div>
        </div>
        <div class="form-group">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">高斯模糊</span>
                <span class="form-control"><input data-filter="gaussBlur" type="range" min="0" max="20" value="0"
                step="1"></span>
            </div>
        </div>
        <div class="form-group">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">对比度</span>
                <span class="form-control"><input data-filter="contrast" type="range" min="-50" max="50" value="0" step="1"></span>
            </div>
        </div>
    </div>
    <div class="form-inline">
        <button type="button" data-filter="restore-binarize" class="btn btn-flat btn-sm btn-right">恢复</button>
        <span class="form-title">轮　廓：</span>
        <div class="form-group">
            <div class="input-group input-group-sm">
                <span class="input-group-addon">二值化阈值</span>
                <span class="form-control"><input data-filter="threshold" type="range" min="0" max="255" value="200" step="1"></span>
            </div>
            <div class="input-group input-group-sm">
                <select id="import-pic-threshold-pre" class="form-control">
                    <option value="">预设</option>
                    <option value="mean">均值</option>
                    <option value="minimum">谷底最小值</option>
                    <option value="intermodes">双峰平均</option>
                    <option value="ostu">大津法</option>
                    <option value="isoData">ISODATA法</option>
                </select>
            </div>
        </div>
        <div class="form-group">
            <span class="input-group">
                <button type="button" data-filter="open" class="btn btn-sm btn-flat btn-new">消除杂点</button>&nbsp;
                <button type="button" data-filter="close" class="btn btn-sm btn-flat btn-new">消除孔洞</button>&nbsp;
                <button type="button" data-filter="dilate" class="btn btn-sm btn-flat btn-new">膨胀</button>&nbsp;
                <button type="button" data-filter="erode" class="btn btn-sm btn-flat btn-new">腐蚀</button>
            </span>
        </div>
    </div>
</div>
