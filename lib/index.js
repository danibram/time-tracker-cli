'use strict';

require('babel-polyfill');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _Task = require('./Task');

var _Task2 = _interopRequireDefault(_Task);

var _Output = require('./Output');

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

moduleexports = function moduleexports(p) {
    var timer = (0, _Manager2.default)();

    _commander2.default.version(_package2.default.version).option('-s, --start <task>', 'Start the timer task.').option('-h, --stop <task>', 'Stops the timer task.').option('-l, --log <task>', 'Logs the timer task.').parse(p.argv);

    if (_commander2.default.start) {
        timer.start(_commander2.default.start);
    } else if (_commander2.default.stop) {
        timer.stop(_commander2.default.stop);
        console.log((0, _Output.humanParseDiff)(timer.getTime(_commander2.default.stop)));
    } else if (_commander2.default.log) {
        setInterval(function () {
            process.stdout.clearLine();
            process.stdout.write('Task: ' + _commander2.default.log + ' ' + (0, _Output.humanParseDiff)(timer.getTime(_commander2.default.log)));
        }, 100);
    }
};
//# sourceMappingURL=index.js.map