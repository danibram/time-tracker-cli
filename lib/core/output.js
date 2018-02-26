'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.markdown = exports.cliSuccess = exports.cliError = exports.outputVertical = exports.outputConfig = exports.sumarize = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _cliTable = require('cli-table2');

var _cliTable2 = _interopRequireDefault(_cliTable);

var _colors = require('colors');

var _colors2 = _interopRequireDefault(_colors);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var sumarize = exports.sumarize = function sumarize(search, tasks, rate, full, format) {
    var table = new _cliTable2.default({
        head: ['Name', 'Description', 'Dates', 'Duration'],
        colAligns: ['left', 'center', 'center', 'left'],
        chars: {
            top: '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            bottom: '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            left: '║',
            'left-mid': '╟',
            right: '║',
            'right-mid': '╢'
        },
        style: { head: ['green'] }
    });
    var total = 0;
    var head = 'Search: ' + search + ' \n';

    tasks.forEach(function (task, index) {
        var description = task.task.description() && task.task.description() !== '' ? task.task.description() : '-';
        var name = task.name;
        task = task.task;

        var duration = task.getSeconds();
        total += duration;

        // Avoid excesive width for proper console fit
        var splitWidth = function splitWidth(str, len) {
            var arr = [];
            while (str != '') {
                if (str.length > len) {
                    arr.push(str.substring(0, len));
                    str = str.substring(len);
                } else {
                    arr.push(str);
                    break;
                }
            }
            return arr.join('\n');
        };
        description = splitWidth(description, 51);
        name = splitWidth(name, 40);

        table.push([name, description, (0, _moment2.default)(task.getStartDate()).format(format), (0, _utils.humanParseDiff)(duration)]);
    });

    if (full) {
        table.push([]);

        if (rate) {
            table.push([{
                rowSpan: 2,
                content: _colors2.default.red('Search:') + ' "' + search + '"',
                vAlign: 'center'
            }, _colors2.default.red('Total time'), (0, _utils.humanParseDiff)(total)], [_colors2.default.red('Rate'), (0, _utils.calcRate)(rate, total)]);
        } else {
            table.push([{
                rowSpan: 2,
                content: _colors2.default.red('Search:') + ' "' + search + '"',
                vAlign: 'center'
            }, { rowSpan: 2, content: '', vAlign: 'center' }, { rowSpan: 2, content: _colors2.default.red('Total time'), vAlign: 'center' }, { rowSpan: 2, content: (0, _utils.humanParseDiff)(total), vAlign: 'center' }], []);
        }
    }

    console.log(table.toString());
};

var outputConfig = exports.outputConfig = function outputConfig(config) {
    var table = new _cliTable2.default({
        head: ['Key', 'value'],
        chars: {
            top: '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            bottom: '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            left: '║',
            'left-mid': '╟',
            right: '║',
            'right-mid': '╢'
        },
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
    console.error(_colors2.default.red('Error: ' + err));
};

var cliSuccess = exports.cliSuccess = function cliSuccess(err) {
    console.log(_colors2.default.green(err));
};

var markdown = exports.markdown = function markdown(tasks) {
    var expanded = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    var body = '| Start | End | Hours | Subtotal | Description |\n';
    body += '| ----- | --- | -----:| -------: | ----------- |\n';
    var total = 0;

    //tasks = start || end ? this.filterDates(tasks, start, end) : tasks;
    tasks.forEach(function (task) {
        var name = task.name;
        task = task.task;

        if (!task.filtered) {
            var duration = task.getSeconds();
            total += duration;

            if (expanded && task.task.timings.length > 1) {
                var subtotal = 0;
                var times = 0;

                task.task.timings.forEach(function (timing) {
                    var secs = (0, _utils.getSeconds)(timing);
                    subtotal += secs;
                    times += 1;
                    body += '|' + (0, _moment2.default)(timing.start).format('YYYY/MM/DD kk:mm') + ('|' + (0, _moment2.default)(timing.stop).format('YYYY/MM/DD kk:mm')) + ('|' + (0, _utils.humanParseDiff)(secs)) + ('|' + (0, _utils.humanParseDiff)(subtotal)) + ('|' + name + ' (part ' + times + ')') + '|\n';
                });
            } else {
                var start = task.getStartDate();
                var stop = task.getEndDate();

                body += '|' + (0, _moment2.default)(start).format('YYYY/MM/DD kk:mm') + ('|' + (0, _moment2.default)(stop).format('YYYY/MM/DD kk:mm')) + ('|' + (0, _utils.humanParseDiff)(duration)) + ('|' + (0, _utils.humanParseDiff)(total)) + ('|' + name) + '|\n';
            }
        }
    });
    body += '| | | |\n';
    body += '| Total | | ' + (0, _utils.humanParseDiff)(total) + ' | | |\n';

    return body;
};
//# sourceMappingURL=output.js.map