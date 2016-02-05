'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Manager = undefined;

var _flat = require('flat');

var _flat2 = _interopRequireDefault(_flat);

var _Task = require('./Task');

var _Task2 = _interopRequireDefault(_Task);

var _configstore = require('configstore');

var _configstore2 = _interopRequireDefault(_configstore);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Manager = exports.Manager = function () {
    function Manager(cfg) {
        _classCallCheck(this, Manager);

        this.tasks = (0, _flat2.default)(cfg.all.tasks);
    }

    _createClass(Manager, [{
        key: 'getTask',
        value: function getTask(name) {
            return this.tasks[name] ? new _Task2.default(this.tasks[name]) : new _Task2.default();
        }
    }, {
        key: 'storeTasks',
        value: function storeTasks() {
            config.set('tasks', _flat2.default.unflatten(this.tasks));
        }
    }, {
        key: 'setTask',
        value: function setTask(name, obj) {
            var update = {};
            update[name] = obj;
            this.tasks = Object.assign({}, this.tasks, update);
        }
    }, {
        key: 'start',
        value: function start(name) {
            var t = this.getTask(name);
            t.start();
            this.storeTasks();
        }
    }, {
        key: 'stop',
        value: function stop(name) {
            var t = this.getTask(name);
            t.stop();
            this.storeTasks();
        }
    }, {
        key: 'getTime',
        value: function getTime(name) {
            var t = this.getTask(name);
            return t.getTime();
        }
    }]);

    return Manager;
}();

var config = new _configstore2.default(_package2.default.name, { tasks: {} });

exports.default = new Manager(config);
//# sourceMappingURL=Manager.js.map