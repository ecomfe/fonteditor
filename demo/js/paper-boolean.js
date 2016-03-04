/**
 * @file paperjs path  boolean 操作
 * @author mengke01(kekee000@gmail.com)
 */

define(function (require) {
    var paper = require('paper');
    var contour2svg = require('fonteditor-core/ttf/util/contour2svg');
    var contours2svg = require('fonteditor-core/ttf/util/contours2svg');


    var booleanStyle = {
        fillColor: new Color(1, 0, 0, 0.5),
        strokeColor: new Color(0, 0, 0),
        strokeWidth: 1.5
    };

    var pathStyleNormal = {
        strokeColor: new Color(0, 0, 0),
        fillColor: new Color(0, 0, 0, 0.1),
        strokeWidth: 1
    };

    var pathStyleBoolean = {
        strokeColor: new Color(0.8),
        fillColor: new Color(0, 0, 0, 0.5),
        strokeWidth: 1
    };

    var contour1 = [{"x":394,"y":138},{"x":339,"y":5},{"x":164,"y":263},{"x":79,"y":165,"onCurve":true},{"x":286,"y":4,"onCurve":true},{"x":385,"y":-80},{"x":422,"y":83},{"x":422,"y":158},{"x":369,"y":211},{"x":295,"y":211}];

    var contour2 = [{"x":597,"y":61,"onCurve":true},{"x":597,"y":62},{"x":595,"y":63},{"x":594,"y":64,"onCurve":true},{"x":586,"y":78},{"x":572,"y":84,"onCurve":true},{"x":459,"y":177},{"x":312,"y":177,"onCurve":true},{"x":163,"y":177},{"x":49,"y":81,"onCurve":true},{"x":42,"y":76},{"x":37,"y":70,"onCurve":true},{"x":36,"y":69},{"x":33,"y":66},{"x":33,"y":65,"onCurve":true},{"x":26,"y":53},{"x":26,"y":39,"onCurve":true},{"x":26,"y":19},{"x":55,"y":-10},{"x":75,"y":-10,"onCurve":true},{"x":91,"y":-10},{"x":105,"y":0,"onCurve":true},{"x":193,"y":80},{"x":312,"y":80,"onCurve":true},{"x":435,"y":80},{"x":524,"y":-4,"onCurve":true},{"x":526,"y":-2,"onCurve":true},{"x":538,"y":-10},{"x":552,"y":-10,"onCurve":true},{"x":573,"y":-10},{"x":601,"y":19},{"x":601,"y":39,"onCurve":true},{"x":601,"y":50},{"x":596,"y":60,"onCurve":true}];


    var contours1 = [[{"x":188.24373119358074,"y":338,"onCurve":true},{"x":207.57372116349052,"y":338},{"x":218.70310932798395,"y":307.73305954825463,"onCurve":true},{"x":221.04613841524576,"y":301.1981519507187},{"x":222.21765295887667,"y":285.7207392197125,"onCurve":true},{"x":222.21765295887667,"y":253.73408624229978},{"x":200.54463390170508,"y":237.22484599589325,"onCurve":true},{"x":193.80842527582752,"y":233.44147843942505},{"x":187.65797392176523,"y":233.44147843942505,"onCurve":true},{"x":161.88465396188565,"y":233.44147843942505},{"x":153.68405215646942,"y":275.7464065708419,"onCurve":true},{"x":153.09829488465402,"y":282.28131416837783},{"x":153.09829488465402,"y":285.7207392197125,"onCurve":true},{"x":153.09829488465402,"y":320.45893223819303},{"x":177.1143430290873,"y":335.9363449691992,"onCurve":true},{"x":182.67903711133397,"y":338}],[{"x":280.20762286860577,"y":330.0893223819302,"onCurve":true},{"x":293.3871614844534,"y":330.0893223819302},{"x":307.445336008024,"y":309.79671457905545,"onCurve":true},{"x":315.3530591775326,"y":296.0390143737166},{"x":315.3530591775326,"y":282.96919917864477,"onCurve":true},{"x":315.3530591775326,"y":261.30082135523617},{"x":296.3159478435306,"y":239.288501026694,"onCurve":true},{"x":285.77231695085254,"y":229.31416837782342},{"x":274.0571715145436,"y":229.31416837782342,"onCurve":true},{"x":272.8856569709128,"y":229.31416837782342,"onCurve":true},{"x":250.6268806419257,"y":229.31416837782342},{"x":242.13340020060184,"y":254.76591375770022,"onCurve":true},{"x":240.08324974924778,"y":264.0523613963039},{"x":240.08324974924778,"y":272.65092402464063,"onCurve":true},{"x":240.08324974924778,"y":306.7012320328542},{"x":270.542627883651,"y":327.6817248459959,"onCurve":true},{"x":274.0571715145436,"y":328.7135523613963}],[{"x":114.14543630892683,"y":260.95687885010267,"onCurve":true},{"x":137.5757271815446,"y":260.95687885010267},{"x":151.92678034102312,"y":226.21868583162217,"onCurve":true},{"x":153.09829488465402,"y":216.93223819301846},{"x":153.68405215646942,"y":207.30184804928132,"onCurve":true},{"x":153.68405215646942,"y":172.56365503080082},{"x":129.66800401203614,"y":161.90143737166323,"onCurve":true},{"x":123.51755265797397,"y":158.80595482546198},{"x":114.14543630892683,"y":158.80595482546198,"onCurve":true},{"x":86.90772316950847,"y":158.80595482546198},{"x":79,"y":201.79876796714575,"onCurve":true},{"x":79,"y":206.61396303901438,"onCurve":true},{"x":79,"y":226.21868583162217},{"x":90.71514543630894,"y":245.82340862422996,"onCurve":true},{"x":100.67301905717147,"y":260.95687885010267}],[{"x":331.4613841524574,"y":235.16119096509237,"onCurve":true},{"x":332.6328986960882,"y":235.16119096509237,"onCurve":true},{"x":358.69909729187566,"y":235.16119096509237},{"x":368.0712136409228,"y":205.2381930184805,"onCurve":true},{"x":371,"y":199.3911704312115},{"x":371,"y":190.79260780287473,"onCurve":true},{"x":371,"y":183.5698151950719,"onCurve":true},{"x":371,"y":136.44969199178644},{"x":334.09729187562687,"y":136.44969199178644,"onCurve":true},{"x":308.61685055165503,"y":136.44969199178644},{"x":300.12337011033105,"y":158.80595482546198,"onCurve":true},{"x":297.4874623871615,"y":171.18788501026694},{"x":297.4874623871615,"y":184.25770020533878,"onCurve":true},{"x":297.4874623871615,"y":235.16119096509237}]];

    var contours2 = [[{"x":316.0105315947844,"y":137.23123670845985,"onCurve":true},{"x":316.0105315947844,"y":100.45054415861722},{"x":261.26634554827274,"y":48.744353182751524},{"x":183.7547176412961,"y":48.744353182751524},{"x":129.01053159478442,"y":100.45054415861722},{"x":129.01053159478442,"y":137.23123670845985,"onCurve":true},{"x":129.01053159478442,"y":162.01822516596246},{"x":143.59192694362162,"y":184.67299956260462,"onCurve":true},{"x":144.87099671106353,"y":186.27216010824998},{"x":165.3361129901332,"y":214.25746965704326},{"x":181.70820601338914,"y":238.24487784172322},{"x":201.9175083389705,"y":275.5586239067809},{"x":207.0337874087379,"y":291.8167561208418,"onCurve":true},{"x":208.56867112966813,"y":296.8807645153853},{"x":217.7779734552496,"y":302.7443531827515},{"x":227.24308973431926,"y":302.7443531827515},{"x":236.70820601338914,"y":296.8807645153853},{"x":237.98727578083094,"y":291.8167561208418,"onCurve":true},{"x":243.10355485059836,"y":275.5586239067809},{"x":263.3128571761798,"y":238.24487784172322},{"x":279.68495019943566,"y":214.25746965704326},{"x":300.1500664785053,"y":186.27216010824998},{"x":301.42913624594723,"y":184.67299956260462,"onCurve":true},{"x":316.0105315947844,"y":162.55127868117756}]];

    var spliter = [
        {"x":307,"y":430,"onCurve":true},{"x":119,"y":-14,"onCurve":true}
    ];

    // 单个路径boolean操作
    function contourboolean(contour1, contour2, operation) {
        var path1 = new paper.Path(contour2svg(contour1));
        var path2 = new paper.Path(contour2svg(contour2));

        // var booleanPath = path1.unite(path2); // 合并
        // var booleanPath = path1.intersect(path2); // 相交
        // var booleanPath = path1.subtract(path2); // 减去
        // var booleanPath = path1.exclude(path2); // 差集
        var booleanPath = path1.divide(path2); // 分割

        booleanPath.style = pathStyleBoolean;
        console.log(booleanPath);
        view.draw();
    }

    // 复合路径boolean操作
    function contoursboolean(contours1, contours2, operation) {
        var path1 = new paper.CompoundPath(contours2svg(contours1));
        var path2 = new paper.CompoundPath(contours2svg(contours2));

        //var booleanPath = path1.unite(path2); // 合并
        var booleanPath = path1.intersect(path2); // 相交
        // var booleanPath = path1.subtract(path2); // 减去
        // var booleanPath = path1.exclude(path2); // 差集
        //var booleanPath = path1.divide(path2); // 分割

        booleanPath.style = pathStyleBoolean;
        view.draw();
        var pathData = booleanPath.getPathData();
        $('#pathresult').attr('d', pathData);
    }

    // 复合路径分割操作
    function contoursdivide(contours1, spliter, operation) {
        var path1 = new paper.CompoundPath(contours2svg(contours1));
        var path2 = new paper.Path({
            segments: [
                [spliter[0].x, spliter[0].y],
                [spliter[1].x, spliter[1].y],
                [spliter[1].x, spliter[1].y]
            ],
            closed: true
        });

        var booleanPath = path1.divide(path2); // 分割

        booleanPath.style = pathStyleBoolean;
        view.draw();
        var a = 0;
        var pathData = booleanPath.getChildren().map(function (path) {
            if (++a % 2) {
                path.moveTo(a * 10, 0);
            }
            return path.getPathData();
        }).join('');
        $('#pathresult').attr('d', pathData);
    }


    var entry = {

        /**
         * 初始化
         */
        init: function () {
            paper.setup(document.getElementById('canvas'));


            // $('#path1').attr('d', contour2svg(contour1));
            // $('#path2').attr('d', contour2svg(contour2));
            // contourboolean(contour1, contour2);

            $('#path1').attr('d', contours2svg(contours2));
            $('#path2').attr('d', contour2svg(spliter));
            // contoursboolean(contours1, contours2);
            contoursdivide(contours2, spliter);
        }
    };

    entry.init();

    return entry;
});
