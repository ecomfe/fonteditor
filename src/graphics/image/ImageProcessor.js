/**
 * @file 图像处理模块
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {
        var cloneImage = require('./util/cloneImage');

        var grayImage = require('./filter/gray');
        var binarizeImage = require('./filter/binarize');
        var brightnessImage = require('./filter/brightness');
        var sharpImage = require('./filter/sharp');
        var gaussBlurImage = require('./filter/gaussBlur');
        var blurImage = require('./filter/blur');
        var reverseImage = require('./filter/reverse');


        var closeImage = require('./filter/close');
        var openImage = require('./filter/open');
        var dilateImage = require('./filter/dilate');
        var erodeImage = require('./filter/erode');

        var getHistogram = require('./util/getHistogram');
        var getThreshold = require('./util/getThreshold');

        /**
         * 灰度图像处理子程序，处理灰度图像和二值图像
         *
         * @param {Object} imageData 图像数据
         */
        function ImageProcessor(imageData) {
            imageData && this.set(imageData);
        }

        /**
         * 设置一个图像数据
         *
         * @param  {Object} imageData 原始图像数据
         * @return {this}
         */
        ImageProcessor.prototype.set = function (imageData) {
            if (!imageData.gray) {
                imageData = grayImage(imageData);
            }

            this.imageData = imageData;
            this.originData = null;
            return this;
        };

        /**
         * 获取当前编辑
         *
         * @return {Object} 图像数据
         */
        ImageProcessor.prototype.get = function () {
            return this.imageData;
        };

        /**
         * 获取上一个保存点
         *
         * @return {Object} 图像数据
         */
        ImageProcessor.prototype.getOrigin = function () {
            return this.originData;
        };


        /**
         * 备份当前编辑
         *
         * @return {this}
         */
        ImageProcessor.prototype.save = function () {
            this.originData = cloneImage(this.imageData);
            return this;
        };

        /**
         * 克隆当前处理器
         *
         * @return {this}
         */
        ImageProcessor.prototype.clone = function () {
            return new ImageProcessor(cloneImage(this.imageData));
        };


        /**
         * 恢复备份
         *
         * @return {this}
         */
        ImageProcessor.prototype.restore = function () {
            if (this.originData) {
                this.imageData =  cloneImage(this.originData);
            }
            return this;
        };

        /**
         * 获取当前图像的直方图信息
         *
         * @return {Array} 灰度直方图信息
         */
        ImageProcessor.prototype.getHistogram = function () {
            return getHistogram(this.imageData);
        };


        /**
         * 根据直方图获取阈值
         *
         * @param  {string} thresholdType 阈值类型
         * @return {number}               阈值
         */
        ImageProcessor.prototype.getThreshold = function (thresholdType) {
            return getThreshold(this.getHistogram(), thresholdType);
        };

        /**
         * 对当前图像进行二值化处理
         *
         * @param  {number} threshold 阈值
         * @return {this}
         */
        ImageProcessor.prototype.binarize = function (threshold) {
            this.imageData = binarizeImage(this.imageData, threshold);
            return this;
        };


        /**
         * 调节图像亮度对比度
         *
         * @param  {string} brightness 亮度 -50 ~ 50
         * @param  {number} contrast   对比度 -50 ~ 50
         * @return {this}
         */
        ImageProcessor.prototype.brightness = function (brightness, contrast) {
            this.imageData = brightnessImage(this.imageData, brightness, contrast);
            return this;
        };



        /**
         * 反转图像
         *
         * @return {this}
         */
        ImageProcessor.prototype.reverse = function () {
            this.imageData = reverseImage(this.imageData);
            return this;
        };

        /**
         * 二值图像开运算
         *
         * @param  {string} mode 模板，'square', 'circle', 'rhomb'
         * @param  {number} radius   半径
         * @return {this}
         */
        ImageProcessor.prototype.close = function (mode, radius) {

            if (!this.imageData.binarize) {
                this.binarize();
            }

            this.imageData = closeImage(this.imageData, mode, radius);
            return this;
        };

        /**
         * 二值图像闭运算
         *
         * @param  {string} mode 模板，'square', 'circle', 'rhomb'
         * @param  {number} radius   半径
         * @return {this}
         */
        ImageProcessor.prototype.open = function (mode, radius) {

            if (!this.imageData.binarize) {
                this.binarize();
            }

            this.imageData = openImage(this.imageData, mode, radius);
            return this;
        };

        /**
         * 二值图像膨胀
         *
         * @param  {string} mode 模板，'square', 'circle', 'rhomb'
         * @param  {number} radius   半径
         * @return {this}
         */
        ImageProcessor.prototype.dilate = function (mode, radius) {

            if (!this.imageData.binarize) {
                this.binarize();
            }

            this.imageData = dilateImage(this.imageData, mode, radius);
            return this;
        };

        /**
         * 二值图像腐蚀
         *
         * @param  {string} mode 模板
         * @param  {number} radius   半径
         * @return {this}
         */
        ImageProcessor.prototype.erode = function (mode, radius) {

            if (!this.imageData.binarize) {
                this.binarize();
            }

            this.imageData = erodeImage(this.imageData, mode, radius);
            return this;
        };


        /**
         * 图像高斯模糊
         *
         * @param  {number} radius 取样区域半径
         * @param  {number} sigma 标准方差, 可选, 默认取值为 1.5
         * @return {this}
         */
        ImageProcessor.prototype.gaussBlur = function (radius, sigma) {
            this.imageData = gaussBlurImage(this.imageData, radius, sigma);
            return this;
        };

        /**
         * 图像均值模糊
         *
         * @param  {number} radius 取样区域半径
         * @return {this}
         */
        ImageProcessor.prototype.blur = function (radius) {
            this.imageData = blurImage(this.imageData, radius);
            return this;
        };

        /**
         * 图像锐化
         *
         * @param  {number} lamta   锐化参数
         * @return {this}
         */
        ImageProcessor.prototype.sharp = function (lamta) {
            this.imageData = sharpImage(this.imageData, lamta);
            return this;
        };

        /**
         * 调节图像亮度对比度
         *
         * @param  {string} brightness 亮度 -50 ~ 50
         * @param  {number} contrast   对比度 -50 ~ 50
         * @return {this}
         */
        ImageProcessor.prototype.brightness = function (brightness, contrast) {
            this.imageData = brightnessImage(this.imageData, brightness, contrast);
            return this;
        };

        /**
         * 注销
         */
        ImageProcessor.prototype.dispose = function () {
            this.imageData = this.originData;
        };

        return ImageProcessor;
    }
);
