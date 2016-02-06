'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sumarize = exports.repeatChar = exports.outputHumanParse = exports.humanParseDiff = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var humanParseDiff = exports.humanParseDiff = function humanParseDiff(secs) {
    var hours = Math.floor(secs / 3600);
    var minutes = Math.floor((secs - hours * 3600) / 60);
    var seconds = secs - hours * 3600 - minutes * 60;
    hours = hours == 0 ? '' : (hours < 10 ? '0' + hours : hours) + 'h ';
    minutes = minutes == 0 ? '' : (minutes < 10 ? '0' + minutes : minutes) + 'm ';
    seconds = (seconds < 10 ? '0' + seconds : seconds) + 's';
    return hours + minutes + seconds;
};

var outputHumanParse = exports.outputHumanParse = function outputHumanParse(secs) {
    var outputDuration = humanParseDiff(secs);
    if (outputDuration.length === 3) {
        outputDuration = repeatChar(' ', 8) + outputDuration;
    } else if (outputDuration.length === 7) {
        outputDuration = repeatChar(' ', 4) + outputDuration;
    }
    return outputDuration;
};

var repeatChar = exports.repeatChar = function repeatChar(char, times) {
    var output = '';
    for (var i = 0; i < times; i++) {
        output += char;
    }
    return output;
};

var sumarize = exports.sumarize = function sumarize(search, tasks) {
    var output = '';
    var total = 0;
    output += 'Search: ' + search + ' \n';
    output += ' ─┐ \n';
    tasks.map(function (task, index) {
        var duration = (0, _moment2.default)(task.task.stop).diff((0, _moment2.default)(task.task.start), 'seconds');
        total += duration;

        var outputDuration = outputHumanParse(duration);

        var name = task.name;
        var startTime = (0, _moment2.default)(task.task.start).format('HH:mm:ss DD/MM/YYYY');

        var time = outputDuration + ' (' + startTime + ') ' + name;
        output += '  ├──> ' + time + '\n';
    });
    output += '  │ \n';
    output += '  └──> ' + outputHumanParse(total) + ' (Total time)\n';
    process.stdout.write(output);
};
//# sourceMappingURL=Output.js.map