/**
 * @file 高斯消元法求解线性方程组
 *
 * reference:
 * https://github.com/itsravenous/gaussian-elimination/blob/master/gauss.js
 *
 * @author mengke01(kekee000@gmail.com)
 */

define(
    function(require) {

        var abs = Math.abs;

        /**
         * 高斯消元法求解线性方程组
         *
         * @param  {Array} $A 参数矩阵
         * @param  {Array} $x 值向量
         * @return {Array} 解向量
         */
        function gauss($A, $x) {
            // Just make a single matrix
            var $i;
            var $k;
            var $maxEl;
            var $maxRow;
            var $tmp;
            var $n = $A.length;

            for ($i = 0; $i < $n; $i++) {
                $A[$i].push($x[$i]);
            }


            for ($i = 0; $i < $n; $i++) {
                // Search for maximum in this column
                $maxEl = abs($A[$i][$i]);
                $maxRow = $i;
                for ($k = $i + 1; $k < $n; $k++) {
                    if (abs($A[$k][$i]) > $maxEl) {
                        $maxEl = abs($A[$k][$i]);
                        $maxRow = $k;
                    }
                }


                // Swap maximum row with current row (column by column)
                for ($k = $i; $k < $n + 1; $k++) {
                    $tmp = $A[$maxRow][$k];
                    $A[$maxRow][$k] = $A[$i][$k];
                    $A[$i][$k] = $tmp;
                }

                // Make all rows below this one 0 in current column
                for ($k = $i + 1; $k < $n; $k++) {
                    $c = -$A[$k][$i] / $A[$i][$i];
                    for ($j = $i; $j < $n + 1; $j++) {
                        if ($i == $j) {
                            $A[$k][$j] = 0;
                        } else {
                            $A[$k][$j] += $c * $A[$i][$j];
                        }
                    }
                }
            }

            // Solve equation Ax=b for an upper triangular matrix $A
            var $x = [];
            for ($i = $n - 1; $i >= 0; $i--) {
                $x[$i] = $A[$i][$n] / $A[$i][$i];
                for ($k = $i - 1; $k > -1; $k--) {
                    $A[$k][$n] -= $A[$k][$i] * $x[$i];
                }
            }

            return $x;
        }


        return gauss;
    }
);
