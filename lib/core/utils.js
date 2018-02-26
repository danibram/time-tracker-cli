'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getSeconds = exports.inPeriod = exports.humanParseDiff = exports.calcRate = exports.recognizeModifierTiming = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var inPeriod = exports.inPeriod = function inPeriod(start, stop, fstart, fstop) {
    fstart = (0, _moment2.default)(fstart, 'YYYY/MM/DD');
    fstop = (0, _moment2.default)(fstop, 'YYYY/MM/DD');

    console.log('fstart', fstart);
    console.log('fstop', fstop);

    if ((0, _moment2.default)(start).isBetween(fstart, fstop, null, '[]') && (0, _moment2.default)(stop).isBetween(fstart, fstop, null, '[]')) {
        console.log('start', start);
        console.log('stop', stop);
        return { isBetween: true, start: start, stop: stop };
    }

    if (!(0, _moment2.default)(start).isBetween(fstart, fstop, null, '[]') && (0, _moment2.default)(stop).isBetween(fstart, fstop, null, '[]')) {
        return { isBetween: true, start: fstart, stop: stop };
    }

    if ((0, _moment2.default)(start).isBetween(fstart, fstop, null, '[]') && !(0, _moment2.default)(stop).isBetween(fstart, fstop, null, '[]')) {
        return { isBetween: true, start: start, stop: fstop };
    }

    return { isBetween: false, start: start, stop: stop };
};

var getSeconds = exports.getSeconds = function getSeconds(_ref) {
    var start = _ref.start,
        stop = _ref.stop;

    if (stop) {
        return (0, _moment2.default)(stop).diff((0, _moment2.default)(start), 'seconds');
    } else {
        return (0, _moment2.default)().diff((0, _moment2.default)(start), 'seconds');
    }
};
//# sourceMappingURL=utils.js.map