'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cliError = exports.outputVertical = exports.outputConfig = exports.sumarize = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _cliTable = require('cli-table');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sumarize = exports.sumarize = function sumarize(search, tasks, rate, full, format) {
    var table = new _cliTable2.default({
        head: ['Duration', 'Dates', 'Task'],
        chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
        colAligns: ['right', 'center', 'left'],
        style: { head: ['green'] }
    });
    var total = 0;
    var head = 'Search: ' + search + ' \n';

    tasks.forEach(function (task, index) {
        var name = task.name;
        task = task.task;

        var duration = task.getSeconds();
        total += duration;

        table.push([(0, _utils.humanParseDiff)(duration), (0, _moment2.default)(task.getStartDate()).format(format), name]);
    });

    console.log(table.toString());

    if (full) {
        var table2 = new _cliTable2.default();
        table2.push({ 'Search': ['\"' + search + '\"'] }, { 'Total time': [(0, _utils.humanParseDiff)(total)] });

        if (rate) {
            table2.push({ 'Rate': [(0, _utils.calcRate)(rate, total)] });
        }

        console.log(table2.toString());
    }
};

var outputConfig = exports.outputConfig = function outputConfig(config) {
    var table = new _cliTable2.default({
        head: ['Key', 'value'],
        chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
        colAligns: ['center', 'center'],
        style: { head: ['green'] }
    });

    Object.keys(config).map(function (e) {
        return table.push([e, config[e]]);
    });

    console.log(table.toString());
};

var outputVertical = exports.outputVertical = function outputVertical() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    var table2 = new _cliTable2.default();
    var key = args.splice(0, 1);
    table2.push(_defineProperty({}, key, args));

    return table2.toString();
};

var cliError = exports.cliError = function cliError(err) {
    console.log('\x1b[31m'); // red
    console.error('Error: ' + err);
    console.log('\x1b[0m'); // end red
};
//# sourceMappingURL=output.js.map