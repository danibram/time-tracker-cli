'use strict';

require('babel-polyfill');

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _updateNotifier = require('update-notifier');

var _updateNotifier2 = _interopRequireDefault(_updateNotifier);

var _Task = require('./Task');

var _Task2 = _interopRequireDefault(_Task);

var _Output = require('./Output');

var _Utils = require('./Utils');

var _Manager = require('./Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _updateNotifier2.default)({ pkg: _package2.default }).notify();

module.exports = function createTimer(p) {

    _commander2.default.version(_package2.default.version).description('Tiny time tracker for projects').option('-s, --start <task> <description>', 'Start the timer task.').option('-f, --finish <task> <description>', 'Stops the timer task.').option('-d, --description <description>', 'Adds a description for the task only in start/stop methods.').option('-a, --add <task> <timeString>', 'Adds time to a task. Example: "1h2m3s"').option('--remove <task> <timeString>', 'Subtract time from a task. Example: "1h2m3s"').option('-l, --log <task>', 'Logs the timer task.').option('-r, --report <task>', 'Report time of the tasks, searched by kay, you can report all using all as key.').option('-e, --export', 'Prints the json of all tasks.').parse(p.argv);

    var description = undefined;
    if (_commander2.default.start) {
        description = _commander2.default.description || _commander2.default.args[0];
        _Manager2.default.start(_commander2.default.start, description);
    } else if (_commander2.default.finish) {
        description = _commander2.default.description || _commander2.default.args[0];
        _Manager2.default.stop(_commander2.default.finish, description);
        console.log((0, _Utils.humanParseDiff)(_Manager2.default.getTime(_commander2.default.finish)));
    } else if (_commander2.default.add) {
        _Manager2.default.modifyTask('add', _commander2.default.add, _commander2.default.args[0]);
        (0, _Output.sumarize)(_commander2.default.add, _Manager2.default.search(_commander2.default.add));
    } else if (_commander2.default.remove) {
        _Manager2.default.modifyTask('subtract', _commander2.default.remove, _commander2.default.args[0]);
        (0, _Output.sumarize)(_commander2.default.remove, _Manager2.default.search(_commander2.default.remove));
    } else if (_commander2.default.log) {
        setInterval(function () {
            process.stdout.clearLine();
            process.stdout.write('\r Task: ' + _commander2.default.log + ' ' + (0, _Utils.humanParseDiff)(_Manager2.default.getTime(_commander2.default.log)));
        }, 100);
    } else if (_commander2.default.report) {
        (0, _Output.sumarize)(_commander2.default.report, _Manager2.default.search(_commander2.default.report), true);
    } else if (_commander2.default.export) {
        console.log(JSON.stringify(_Manager2.default.getTasksJson(), null, 4));
    }
};
//# sourceMappingURL=index.js.map