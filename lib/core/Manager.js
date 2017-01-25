'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

var _Task = require('./Task');

var _Task2 = _interopRequireDefault(_Task);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _utils = require('./utils');

var _constants = require('./constants');

var _output = require('./output');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = function () {
    function Manager(cfg) {
        var _this = this;

        _classCallCheck(this, Manager);

        this.configElements = ['format.output'];
        this.repositories = ['tasks', 'config'];

        this.cfg = cfg;
        this.tasks = cfg.all.tasks;
        this.config = cfg.all.config ? cfg.all.config : {};

        if (!this.config['config.version']) {
            this.migrateToV2(this.tasks).then(function (migratedTasks) {
                _this.cfg.set('tasks', migratedTasks);
                _this.cfg.set('config', Object.assign(_this.config, {
                    'config.version': 2
                }));
            }, _output.cliError).catch(_output.cliError);
        }
    }

    _createClass(Manager, [{
        key: 'getTask',
        value: function getTask(key) {
            var task = this.tasks[key] ? this.tasks[key] : null;
            return new _Task2.default(task);
        }
    }, {
        key: 'storeTask',
        value: function storeTask(key, task) {
            var update = {};
            update[key] = task.get();
            this.tasks = Object.assign({}, this.tasks, update);
            this.cfg.set('tasks', this.tasks);
        }
    }, {
        key: 'startTask',
        value: function startTask(key, description) {
            var _this2 = this;

            var t = this.getTask(key);
            t.start(description).then(function () {
                _this2.storeTask(key, t);
                console.log((0, _output.outputVertical)('Task:', key, _constants.STARTED, (0, _moment2.default)().toISOString()));
            }, _output.cliError).catch(_output.cliError);
        }
    }, {
        key: 'pauseTask',
        value: function pauseTask(key) {
            var _this3 = this;

            var t = this.getTask(key);
            t.pause().then(function () {
                _this3.storeTask(key, t);
                console.log((0, _output.outputVertical)('Task:', key, _constants.PAUSED, (0, _moment2.default)().toISOString()));
            }, _output.cliError).catch(_output.cliError);
        }
    }, {
        key: 'unpauseTask',
        value: function unpauseTask(key) {
            var _this4 = this;

            var t = this.getTask(key);
            t.unpause().then(function () {
                _this4.storeTask(key, t);
                console.log((0, _output.outputVertical)('Task:', key, _constants.UNPAUSED, (0, _moment2.default)().toISOString()));
            }, _output.cliError).catch(_output.cliError);
        }
    }, {
        key: 'stopTask',
        value: function stopTask(key, description) {
            var _this5 = this;

            var t = this.getTask(key);
            t.stop(description).then(function () {
                _this5.storeTask(key, t);
                console.log((0, _output.outputVertical)('Task:', key, _constants.FINISHED, (0, _moment2.default)().toISOString()));
            }, _output.cliError).catch(_output.cliError);
        }
    }, {
        key: 'addDescription',
        value: function addDescription(key, text) {
            var t = this.getTask(key);
            t.setDescription(text);
            this.storeTask(key, t);
        }
    }, {
        key: 'getTime',
        value: function getTime(name) {
            var t = this.getTask(name);
            return t.getSeconds();
        }
    }, {
        key: 'modifyTask',
        value: function modifyTask(operation, name, stringTime) {
            var _this6 = this;

            var t = this.getTask(name);
            t.makeOperationOverTime(operation, stringTime).then(function () {
                _this6.storeTask(name, t);
            }, _output.cliError).catch(_output.cliError);
        }
    }, {
        key: 'search',
        value: function search(string) {
            var _this7 = this;

            var keys = Object.keys(this.tasks);
            var tasks = [];
            keys.forEach(function (key) {
                if (string === 'all' || key.indexOf(string) > -1) {
                    tasks.push({
                        name: key,
                        task: new _Task2.default(_this7.tasks[key])
                    });
                }
            });
            return tasks;
        }
    }, {
        key: 'getTasksJson',
        value: function getTasksJson() {
            return _flat2.default.unflatten(this.tasks);
        }
    }, {
        key: 'getConfig',
        value: function getConfig() {
            return this.config;
        }
    }, {
        key: 'configure',
        value: function configure(element, value) {

            if (this.configElements.indexOf(element) < 0) {
                return (0, _output.cliError)('Config key (' + element + ') not allowed, allowed keys: ' + this.configElements.toString() + ' ');
            }

            var newCfg = _defineProperty({}, element, value);

            this.config = Object.assign({}, this.config, newCfg);
            this.cfg.set('config', this.config);

            return this.config;
        }
    }, {
        key: 'migrateToV2',
        value: function migrateToV2(tasks) {
            return new Promise(function (resolve, reject) {
                Object.keys(tasks).forEach(function (k) {
                    if (!tasks[k].timings) {
                        reject('Config migrated');
                    }

                    if (!tasks[k].start && !tasks[k].stop) {
                        reject('Config corrupted or migrated');
                    }

                    tasks[k].timings = [{
                        start: tasks[k].start ? tasks[k].start : null,
                        stop: tasks[k].stop ? tasks[k].stop : null
                    }];

                    delete tasks[k].start;
                    delete tasks[k].stop;
                });

                resolve(tasks);
            });
        }
    }, {
        key: 'sumarize',
        value: function sumarize(key, rate) {
            var full = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

            var tasks = this.search(key);
            (0, _output.sumarize)(key, tasks, rate, full, this.config['format.output']);
        }
    }]);

    return Manager;
}();

exports.default = Manager;
//# sourceMappingURL=Manager.js.map