'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {
    function Task(task) {
        _classCallCheck(this, Task);

        this.startT = task.start ? (0, _moment2.default)(task.start) : null;
        this.stopT = task.stop ? (0, _moment2.default)(task.stop) : null;

        if (task.start && !task.stop) {
            this.status = _constants.inProgress;
        }

        if (task.start && task.stop) {
            this.status = _constants.finished;
        }
    }

    _createClass(Task, [{
        key: 'start',
        value: function start() {
            if (!this.startT) {
                this.startT = (0, _moment2.default)().toDate();
            }
        }
    }, {
        key: 'stop',
        value: function stop() {
            if (!this.stopT) {
                this.stopT = (0, _moment2.default)().toDate();
            }
        }
    }, {
        key: 'getTime',
        value: function getTime() {
            if (this.stop) {
                return this.stop.diff(this.startT, 'seconds');
            } else {
                return (0, _moment2.default)().diff(this.startT, 'seconds');
            }
        }
    }]);

    return Task;
}();

exports.default = Task;
//# sourceMappingURL=Task.js.map