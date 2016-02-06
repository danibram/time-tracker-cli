'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Manager = undefined;

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _configstore = require('configstore');

var _configstore2 = _interopRequireDefault(_configstore);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = exports.Manager = function () {
    function Manager(cfg) {
        _classCallCheck(this, Manager);

        this.tasks = cfg.all.tasks;
    }

    _createClass(Manager, [{
        key: 'getTask',
        value: function getTask(name) {
            return this.tasks[name] ? this.tasks[name] : {};
        }
    }, {
        key: 'storeTasks',
        value: function storeTasks() {
            config.set('tasks', this.tasks);
        }
    }, {
        key: 'setTask',
        value: function setTask(name, obj) {
            var update = {};
            update[name] = obj;
            this.tasks = Object.assign({}, this.tasks, update);
            this.storeTasks();
        }
    }, {
        key: 'start',
        value: function start(name, description) {
            var t = this.getTask(name);
            if (!t.start) {
                t.start = (0, _moment2.default)().toDate();
                if (description) t.description = description;
                this.setTask(name, t);
            }
        }
    }, {
        key: 'stop',
        value: function stop(name, description) {
            var t = this.getTask(name);
            if (!t.stop) {
                t.stop = (0, _moment2.default)().toDate();
                if (description) t.description = description;
                this.setTask(name, t);
            }
        }
    }, {
        key: 'getTime',
        value: function getTime(name) {
            var t = this.getTask(name);
            if (t.stop) {
                return (0, _moment2.default)(t.stop).diff((0, _moment2.default)(t.start), 'seconds');
            } else {
                return (0, _moment2.default)().diff((0, _moment2.default)(t.start), 'seconds');
            }
        }
    }, {
        key: 'search',
        value: function search(string) {
            var _this = this;

            var keys = Object.keys(this.tasks);
            var tasks = [];
            keys.map(function (key) {
                if (string === 'all' || key.indexOf(string) > -1) {
                    tasks.push({
                        name: key,
                        task: _this.tasks[key]
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
    }]);

    return Manager;
}();

var config = new _configstore2.default(_package2.default.name, { tasks: {} });

exports.default = new Manager(config);
//# sourceMappingURL=Manager.js.map