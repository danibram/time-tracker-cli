'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Timer = function () {
    function Timer(tasks) {
        _classCallCheck(this, Timer);

        this.tasks = tasks;
    }

    _createClass(Timer, [{
        key: 'getTasks',
        value: function getTasks() {
            return this.tasks;
        }
    }, {
        key: 'getTask',
        value: function getTask(name) {
            return this.tasks[name] ? this.tasks[name] : {};
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
            if (!t.start) {
                this.setTask(name, { start: (0, _moment2.default)() });
            }
        }
    }, {
        key: 'stop',
        value: function stop(name) {
            var t = this.getTask(name);
            if (!t.stop && t.start) {
                this.setTask(name, { start: t.start, stop: (0, _moment2.default)() });
            }
        }
    }, {
        key: 'getTime',
        value: function getTime(name) {
            var t = this.getTask(name);
            if (t.start) {
                return (0, _moment2.default)().diff(t.start, 'seconds');
            }
        }
    }, {
        key: 'humanParseDiff',
        value: function humanParseDiff(secs) {
            var hours = Math.floor(secs / 3600);
            var minutes = Math.floor((secs - hours * 3600) / 60);
            var seconds = secs - hours * 3600 - minutes * 60;

            return (hours < 10 ? "0" + hours : hours) + "h " + (minutes < 10 ? "0" + minutes : minutes) + "m " + (seconds < 10 ? "0" + seconds : seconds) + "s";
        }
    }]);

    return Timer;
}();

exports.default = Timer;
//# sourceMappingURL=Timer.js.map