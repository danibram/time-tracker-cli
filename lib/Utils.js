'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var recognizeModifierTiming = exports.recognizeModifierTiming = function recognizeModifierTiming(string) {
    var r = /(\d{1,})([hms])/g;
    var arr = undefined;
    var res = [];
    while ((arr = r.exec(string)) !== null) {
        res.push({
            value: arr[1],
            momentKey: arr[2]
        });
    }
    return res;
};

var humanParseDiff = exports.humanParseDiff = function humanParseDiff(secs) {
    var hours = Math.floor(secs / 3600);
    var minutes = Math.floor((secs - hours * 3600) / 60);
    var seconds = secs - hours * 3600 - minutes * 60;
    hours = hours == 0 ? '' : (hours < 10 ? '0' + hours : hours) + 'h ';
    minutes = minutes == 0 && hours == '' ? '' : (minutes < 10 ? '0' + minutes : minutes) + 'm ';
    seconds = seconds == 0 ? '' : (seconds < 10 ? '0' + seconds : seconds) + 's';
    return hours + minutes + seconds;
};
//# sourceMappingURL=Utils.js.map