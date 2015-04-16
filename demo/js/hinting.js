/**
 * @file 检查hint设置情况
 * @author mengke01(kekee000@gmail.com)
 *
 * copy from:
 * https://github.com/mozilla/pdf.js/blob/master/src/core/core.js
 */

define(
    function (require) {

        var TTOpsStackDeltas = [
            0, 0, 0, 0, 0, 0, 0, 0, -2, -2, -2, -2, 0, 0, -2, -5, -1, -1, -1, -1, -1, -1, -1,
            -1, 0, 0, -1, 0, -1, -1, -1, -1, 1, -1, -999, 0, 1, 0, -1, -2, 0, -1, -2, -1, -1,
            0, -1, -1, 0, 0, -999, -999, -1, -1, -1, -1, -2, -999, -2, -2, -999, 0, -2, -2, 0,
            0, -2, 0, -2, 0, 0, 0, -2, -1, -1, 1, 1, 0, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0, -1,
            0, -1, -1, 0, -999, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -2,
            -999, -999, -999, -999, -999, -1, -1, -2, -2, 0, 0, 0, 0, -1, -1, -999, -2, -2, 0,
            0, -1, -2, -2, 0, 0, 0, -1, -1, -1, -2
        ];

        // 0xC0-DF == -1 and 0xE0-FF == -2

        function sanitizeTTProgram(data, ttContext) {

            var i = 0;
            var j;
            var n;
            var b;
            var funcId;
            var pc;
            var lastEndf = 0,
            var lastDeff = 0;
            var stack = [];
            var callstack = [];
            var functionsCalled = [];
            var tooComplexToFollowFunctions =
                ttContext.tooComplexToFollowFunctions;
            var inFDEF = false;
            var ifLevel = 0;
            var inELSE = 0;
            for (var ii = data.length; i < ii;) {
                var op = data[i++];
                // The TrueType instruction set docs can be found at
                // https://developer.apple.com/fonts/TTRefMan/RM05/Chap5.html
                if (op === 0x40) { // NPUSHB - pushes n bytes
                    n = data[i++];
                    if (inFDEF || inELSE) {
                        i += n;
                    } else {
                        for (j = 0; j < n; j++) {
                            stack.push(data[i++]);
                        }
                    }
                }
                else if (op === 0x41) { // NPUSHW - pushes n words
                    n = data[i++];
                    if (inFDEF || inELSE) {
                        i += n * 2;
                    }
                    else {
                        for (j = 0; j < n; j++) {
                            b = data[i++];
                            stack.push((b << 8) | data[i++]);
                        }
                    }
                }
                else if ((op & 0xF8) === 0xB0) { // PUSHB - pushes bytes
                    n = op - 0xB0 + 1;
                    if (inFDEF || inELSE) {
                        i += n;
                    }
                    else {
                        for (j = 0; j < n; j++) {
                            stack.push(data[i++]);
                        }
                    }
                }
                else if ((op & 0xF8) === 0xB8) { // PUSHW - pushes words
                    n = op - 0xB8 + 1;
                    if (inFDEF || inELSE) {
                        i += n * 2;
                    }
                    else {
                        for (j = 0; j < n; j++) {
                            b = data[i++];
                            stack.push((b << 8) | data[i++]);
                        }
                    }
                }
                else if (op === 0x2B && !tooComplexToFollowFunctions) { // CALL
                    if (!inFDEF && !inELSE) {
                        // collecting inforamtion about which functions are used
                        funcId = stack[stack.length - 1];
                        ttContext.functionsUsed[funcId] = true;
                        if (funcId in ttContext.functionsStackDeltas) {
                            stack.length += ttContext.functionsStackDeltas[funcId];
                        }
                        else if (funcId in ttContext.functionsDefined &&
                            functionsCalled.indexOf(funcId) < 0) {
                            callstack.push({
                                data: data,
                                i: i,
                                stackTop: stack.length - 1
                            });
                            functionsCalled.push(funcId);
                            pc = ttContext.functionsDefined[funcId];
                            if (!pc) {
                                warn('TT: CALL non-existent function');
                                ttContext.hintsValid = false;
                                return;
                            }
                            data = pc.data;
                            i = pc.i;
                        }
                    }
                }
                else if (op === 0x2C && !tooComplexToFollowFunctions) { // FDEF
                    if (inFDEF || inELSE) {
                        warn('TT: nested FDEFs not allowed');
                        tooComplexToFollowFunctions = true;
                    }
                    inFDEF = true;
                    // collecting inforamtion about which functions are defined
                    lastDeff = i;
                    funcId = stack.pop();
                    ttContext.functionsDefined[funcId] = {
                        data: data,
                        i: i
                    };
                }
                else if (op === 0x2D) { // ENDF - end of function
                    if (inFDEF) {
                        inFDEF = false;
                        lastEndf = i;
                    }
                    else {
                        pc = callstack.pop();
                        if (!pc) {
                            warn('TT: ENDF bad stack');
                            ttContext.hintsValid = false;
                            return;
                        }
                        funcId = functionsCalled.pop();
                        data = pc.data;
                        i = pc.i;
                        ttContext.functionsStackDeltas[funcId] =
                            stack.length - pc.stackTop;
                    }
                }
                 else if (op === 0x89) { // IDEF - instruction definition
                    if (inFDEF || inELSE) {
                        warn('TT: nested IDEFs not allowed');
                        tooComplexToFollowFunctions = true;
                    }
                    inFDEF = true;
                    // recording it as a function to track ENDF
                    lastDeff = i;
                }
                 else if (op === 0x58) { // IF
                    ++ifLevel;
                }
                 else if (op === 0x1B) { // ELSE
                    inELSE = ifLevel;
                }
                else if (op === 0x59) { // EIF
                    if (inELSE === ifLevel) {
                        inELSE = 0;
                    }
                    --ifLevel;
                }
                else if (op === 0x1C) { // JMPR
                    if (!inFDEF && !inELSE) {
                        var offset = stack[stack.length - 1];
                        // only jumping forward to prevent infinite loop
                        if (offset > 0) {
                            i += offset - 1;
                        }
                    }
                }
                // Adjusting stack not extactly, but just enough to get function id
                if (!inFDEF && !inELSE) {
                    var stackDelta = op <= 0x8E
                        ? TTOpsStackDeltas[op]
                        : op >= 0xC0 && op <= 0xDF ? -1 : op >= 0xE0 ? -2 : 0;
                    if (op >= 0x71 && op <= 0x75) {
                        n = stack.pop();
                        if (n === n) {
                            stackDelta = -n * 2;
                        }
                    }

                    while (stackDelta < 0 && stack.length > 0) {
                        stack.pop();
                        stackDelta++;
                    }

                    while (stackDelta > 0) {
                        stack.push(NaN); // pushing any number into stack
                        stackDelta--;
                    }
                }
            }

            ttContext.tooComplexToFollowFunctions = tooComplexToFollowFunctions;

            var content = [data];
            if (i > data.length) {
                content.push(new Uint8Array(i - data.length));
            }

            if (lastDeff > lastEndf) {
                warn('TT: complementing a missing function tail');
                // new function definition started, but not finished
                // complete function by [CLEAR, ENDF]
                content.push(new Uint8Array([0x22, 0x2D]));
            }

            foldTTTable(table, content);
        }

        function checkInvalidFunctions(ttContext, maxFunctionDefs) {
            if (ttContext.tooComplexToFollowFunctions) {
                return;
            }
            if (ttContext.functionsDefined.length > maxFunctionDefs) {
                warn('TT: more functions defined than expected');
                ttContext.hintsValid = false;
                return;
            }
            for (var j = 0, jj = ttContext.functionsUsed.length; j < jj; j++) {
                if (j > maxFunctionDefs) {
                    warn('TT: invalid function id: ' + j);
                    ttContext.hintsValid = false;
                    return;
                }
                if (ttContext.functionsUsed[j] && !ttContext.functionsDefined[j]) {
                    warn('TT: undefined function: ' + j);
                    ttContext.hintsValid = false;
                    return;
                }
            }
        }


        var hinting = {
        };

        return hinting;
    }
);
