/**
 * @file 图像二值化相关的阈值处理函数
 *
 * 代码来源于:
 * http://blog.csdn.net/laviewpbt/article/details/11306685
 *
 * @author mengke01(kekee000@gmail.com)
 */


define(
    function (require) {


        /**
         * 检测直方图是否为双峰
         *
         * @param {Array} HistGram 灰度数据
         * @return {boolean} 是否为双峰
         */
        function isDimodal(HistGram) {

            // 对直方图的峰进行计数，只有峰数位2才为双峰
            var Count = 0;
            for (var Y = 1; Y < 255; Y++) {
                if (HistGram[Y - 1] < HistGram[Y] && HistGram[Y + 1] < HistGram[Y]) {
                    Count++;
                    if (Count > 2) {
                        return false;
                    }
                }
            }

            return Count === 2 ? true : false;
        }



        var threshold = {

            /**
             * 基于灰度平均值的阈值
             *
             * @param  {Array} histGram 灰度数据
             * @return {number}          阈值
             */
            mean: function (histGram) {
                var sum = 0;
                var amount = 0;
                for (var y = 0; y < 256; y++) {
                    amount += histGram[y];
                    sum += y * histGram[y];
                }
                return sum / amount;
            },

            /**
             * 基于谷底最小值的阈值
             * 此方法实用于具有明显双峰直方图的图像，其寻找双峰的谷底作为阈值
             * J. M. S. Prewitt and M. L. Mendelsohn, "The analysis of cell images," in
             * nnals of the New York Academy of Sciences, vol. 128, pp. 1035-1053, 1966.
             * C. A. Glasbey, "An analysis of histogram-based thresholding algorithms,"
             * CVGIP: Graphical Models and Image Processing, vol. 55, pp. 532-537, 1993.
             *
             * @param  {Array} HistGram 灰度数据
             * @return {number}          阈值
             */
            minimum: function (HistGram) {
                var Y;
                var Iter = 0;
                var HistGramC = []; // 基于精度问题，一定要用浮点数来处理，否则得不到正确的结果
                var HistGramCC = []; // 求均值的过程会破坏前面的数据，因此需要两份数据
                for (Y = 0; Y < 256; Y++) {
                    HistGramC[Y] = HistGram[Y];
                    HistGramCC[Y] = HistGram[Y];
                }

                // 通过三点求均值来平滑直方图
                // 判断是否已经是双峰的图像了
                while (!isDimodal(HistGramCC)) {

                    // 第一点
                    HistGramCC[0] = (HistGramC[0] + HistGramC[0] + HistGramC[1]) / 3;
                    // 中间的点
                    for (Y = 1; Y < 255; Y++) {
                        HistGramCC[Y] = (HistGramC[Y - 1] + HistGramC[Y] + HistGramC[Y + 1]) / 3;
                    }

                    // 最后一点
                    HistGramCC[255] = (HistGramC[254] + HistGramC[255] + HistGramC[255]) / 3;
                    Iter++;
                    // 直方图无法平滑为双峰的，返回错误代码
                    if (Iter >= 1000) {
                        return -1;
                    }

                    HistGramC = HistGramCC.slice(0);
                }

                // 阈值极为两峰之间的最小值
                var peakfound = false;
                for (Y = 1; Y < 255; Y++) {
                    if (HistGramCC[Y - 1] < HistGramCC[Y] && HistGramCC[Y + 1] < HistGramCC[Y]) {
                        peakfound = true;
                    }

                    if (peakfound && HistGramCC[Y - 1] >= HistGramCC[Y] && HistGramCC[Y + 1] >= HistGramCC[Y]) {
                        return 255 - (Y - 1);
                    }
                }

                return -1;
            },

            /**
             * 基于双峰平均值的阈值
             *
             * @param  {Array} HistGram 灰度数据
             * @return {number}          阈值
             */
            intermodes: function (HistGram) {
                var Y;
                var Iter = 0;
                var Index;
                var HistGramC = []; // 基于精度问题，一定要用浮点数来处理，否则得不到正确的结果
                var HistGramCC = []; // 求均值的过程会破坏前面的数据，因此需要两份数据

                for (Y = 0; Y < 256; Y++) {
                    HistGramC[Y] = HistGram[Y];
                    HistGramCC[Y] = HistGram[Y];
                }

                // 通过三点求均值来平滑直方图
                // 判断是否已经是双峰的图像了
                while (!isDimodal(HistGramCC)) {
                    // 第一点
                    HistGramCC[0] = (HistGramC[0] + HistGramC[0] + HistGramC[1]) / 3;
                    // 中间的点
                    for (Y = 1; Y < 255; Y++) {
                        HistGramCC[Y] = (HistGramC[Y - 1] + HistGramC[Y] + HistGramC[Y + 1]) / 3;
                    }
                    // 最后一点
                    HistGramCC[255] = (HistGramC[254] + HistGramC[255] + HistGramC[255]) / 3;

                    Iter++;
                    // 似乎直方图无法平滑为双峰的，返回错误代码
                    if (Iter >= 1000) {
                        return -1;
                    }

                    HistGramC = HistGramCC.slice(0);
                }

                // 阈值为两峰值的平均值
                var Peak = [0, 0];
                for (Y = 1, Index = 0; Y < 255; Y++) {
                    if (HistGramCC[Y - 1] < HistGramCC[Y] && HistGramCC[Y + 1] < HistGramCC[Y]) {
                        Peak[Index++] = Y - 1;
                    }
                }

                return 255 - ((Peak[0] + Peak[1]) / 2);
            },

            /**
             * 大津法
             *
             * @param  {Array} HistGram 灰度数据
             * @return {number}          阈值
             */
            ostu: function (HistGram) {

                var Y;
                var Amount = 0;
                var PixelBack = 0;
                var PixelFore = 0;
                var PixelIntegralBack = 0;
                var PixelIntegralFore = 0;
                var PixelIntegral = 0;

                // 类间方差
                var OmegaBack;
                var OmegaFore;
                var MicroBack;
                var MicroFore;
                var SigmaB;
                var Sigma;

                var MinValue;
                var MaxValue;
                var Threshold = 0;

                // 求最大值和最小值
                for (MinValue = 0; MinValue < 256 && HistGram[MinValue] === 0; MinValue++) {
                }

                for (MaxValue = 255; MaxValue > MinValue && HistGram[MinValue] === 0; MaxValue--) {
                }

                // 图像中只有一个颜色
                if (MaxValue === MinValue) {
                    return MaxValue;
                }

                // 图像中只有二个颜色
                if (MinValue + 1 === MaxValue) {
                    return MinValue;
                }

                // 像素总数
                for (Y = MinValue; Y <= MaxValue; Y++) {
                    Amount += HistGram[Y];
                }

                PixelIntegral = 0;
                for (Y = MinValue; Y <= MaxValue; Y++) {
                    PixelIntegral += HistGram[Y] * Y;
                }

                SigmaB = -1;

                for (Y = MinValue; Y < MaxValue; Y++) {
                    PixelBack = PixelBack + HistGram[Y];
                    PixelFore = Amount - PixelBack;
                    OmegaBack = PixelBack / Amount;
                    OmegaFore = PixelFore / Amount;
                    PixelIntegralBack += HistGram[Y] * Y;
                    PixelIntegralFore = PixelIntegral - PixelIntegralBack;
                    MicroBack = PixelIntegralBack / PixelBack;
                    MicroFore = PixelIntegralFore / PixelFore;
                    Sigma = OmegaBack * OmegaFore * (MicroBack - MicroFore) * (MicroBack - MicroFore);

                    if (Sigma > SigmaB) {
                        SigmaB = Sigma;
                        Threshold = Y;
                    }
                }

                return Threshold;
            },

            /**
             * ISODATA法
             *
             * @param  {Array} HistGram 灰度数据
             * @return {number}          阈值
             */
            isoData: function (HistGram) {
                var i;
                var g = 0;
                var length = HistGram.length;

                for (i = 1; i < length; i++) {
                    if (HistGram[i] > 0) {
                        g = i + 1;
                        break;
                    }
                }

                var l;
                var toth;
                var totl;
                var h;

                for (;;) {
                    l = 0;
                    totl = 0;
                    for (i = 0; i < g; i++) {
                        totl = totl + HistGram[i];
                        l = l + (HistGram[i] * i);
                    }
                    h = 0;
                    toth = 0;

                    for (i = g + 1; i < length; i++) {
                        toth += HistGram[i];
                        h += (HistGram[i] * i);
                    }

                    if (totl > 0 && toth > 0) {
                        l /= totl;
                        h /= toth;
                        if (g === Math.round((l + h) / 2.0)) {
                            break;
                        }
                    }

                    g++;

                    if (g > length - 2) {
                        return 0;
                    }
                }

                return g;
            }

        };

        return threshold;
    }
);
