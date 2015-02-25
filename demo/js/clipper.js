/**
 * @file
 * @author kekee000@gmail.com
 */



define(
    function (require) {

        var ClipperLib = require('ClipperLib');
        /**
         * desc
         *
         * @type {Object}
         */
        var entry = {

            init: function () {
                var canvas = $('#canvas').get(0);
                var ctx = canvas.getContext('2d');
                var width = canvas.offsetWidth;
                var height = canvas.offsetHeight;

                var subj_paths = [[{X:10,Y:10},{X:110,Y:10},{X:110,Y:110},{X:10,Y:110}],
                                      [{X:20,Y:20},{X:20,Y:100},{X:100,Y:100},{X:100,Y:20}]];
                var clip_paths = [[{X:50,Y:50},{X:150,Y:50},{X:150,Y:150},{X:50,Y:150}],
                                      [{X:60,Y:60},{X:60,Y:140},{X:140,Y:140},{X:140,Y:60}]];
                var solution_paths = [];
                var cpr = new ClipperLib.Clipper();
                var scale = 100;
                ClipperLib.JS.ScaleUpPaths(subj_paths, scale);
                ClipperLib.JS.ScaleUpPaths(clip_paths, scale);

                cpr.AddPaths(subj_paths, ClipperLib.PolyType.ptSubject, true);
                cpr.AddPaths(clip_paths, ClipperLib.PolyType.ptClip, true);
                var succeeded = cpr.Execute(ClipperLib.ClipType.ctXor, solution_paths, ClipperLib.PolyFillType.pftNonZero, ClipperLib.PolyFillType.pftNonZero);
                ClipperLib.JS.ScaleDownPaths(solution_paths, scale);
                console.log(succeeded);
                console.log(solution_paths);
                solution_paths.forEach(function (path) {
                    var start = path.shift();
                    ctx.moveTo(start.X, start.Y);
                    path.forEach(function (point) {
                        ctx.lineTo(point.X, point.Y);
                    });
                    ctx.lineTo(start.X, start.Y);
                });
                ctx.fill();
            }
        };

        entry.init();

        return entry;
    }
);
