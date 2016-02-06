'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sumarize = exports.repeatChar = exports.humanParseDiff = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var humanParseDiff = exports.humanParseDiff = function humanParseDiff(secs) {
    var hours = Math.floor(secs / 3600);
    var minutes = Math.floor((secs - hours * 3600) / 60);
    var seconds = secs - hours * 3600 - minutes * 60;
    hours = hours == 0 ? '' : (hours < 10 ? '0' + hours : hours) + 'h ';
    minutes = minutes == 0 && hours == '' ? '' : (minutes < 10 ? '0' + minutes : minutes) + 'm ';
    seconds = seconds == 0 ? '' : (seconds < 10 ? '0' + seconds : seconds) + 's';
    return hours + minutes + seconds;
};

var repeatChar = exports.repeatChar = function repeatChar(char, times) {
    var output = '';
    for (var i = 0; i < times; i++) {
        output += char;
    }
    return output;
};

var sumarize = exports.sumarize = function sumarize(search, tasks) {
    var table = new _cliTable2.default({
        head: ['Time', 'Start', 'Task'],
        chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' }
    });
    var total = 0;
    var head = 'Search: ' + search + ' \n';

    tasks.map(function (task, index) {
        var duration = (0, _moment2.default)(task.task.stop).diff((0, _moment2.default)(task.task.start), 'seconds');
        total += duration;

        var outputDuration = humanParseDiff(duration);

        var name = task.name;
        var startTime = (0, _moment2.default)(task.task.start).format('DD/MM/YYYY');

        table.push([outputDuration, startTime, name]);
    });

    console.log(table.toString());
    var table2 = new _cliTable2.default();
    table2.push(['Search: ' + search, 'Total time', humanParseDiff(total)]);
    console.log(table2.toString());
};
//# sourceMappingURL=Output.js.map