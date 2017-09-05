'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var recognizeModifierTiming = exports.recognizeModifierTiming = function recognizeModifierTiming(string) {
    var r = /(\d{1,})([hms])/g;
    var arr = void 0;
    var res = [];
    while ((arr = r.exec(string)) !== null) {
        res.push({
            value: arr[1],
            momentKey: arr[2]
        });
    }

    return res;
};

var calcRate = exports.calcRate = function calcRate(rate, total) {
    var amount = void 0;
    var mod = rate.substr(rate.length - 1);
    var value = rate.slice(0, rate.length - 1);

    switch (mod) {
        case 'h':
            amount = total / 60 / 60 * parseFloat(value);
            break;
        case 'm':
            amount = total / 60 * parseFloat(value);
            break;
        case 's':
            amount = total * parseFloat(value);
            break;
    }

    return amount.toFixed(2);
};

var humanParseDiff = exports.humanParseDiff = function humanParseDiff(secs) {
    var hours = Math.floor(secs / 3600);
    var minutes = Math.floor((secs - hours * 3600) / 60);
    var seconds = secs - hours * 3600 - minutes * 60;
    hours = hours == 0 ? '00h' : (hours < 10 ? '0' + hours : hours) + 'h';
    minutes = minutes == 0 && hours == '' ? '00m' : (minutes < 10 ? '0' + minutes : minutes) + 'm';
    seconds = seconds == 0 ? '00s' : (seconds < 10 ? '0' + seconds : seconds) + 's';
    return hours + ' ' + minutes + ' ' + seconds;
};
//# sourceMappingURL=utils.js.map