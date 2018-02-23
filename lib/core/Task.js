'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _constants = require('./constants');

var _utils = require('./utils');

var _output = require('./output');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {
    function Task(task) {
        _classCallCheck(this, Task);

        this.task = task ? task : {
            description: '',
            timings: []
        };
    }

    _createClass(Task, [{
        key: '_calcTime',
        value: function _calcTime(t) {
            if (t.stop) {
                return (0, _moment2.default)(t.stop).diff((0, _moment2.default)(t.start), 'seconds');
            } else {
                return (0, _moment2.default)().diff((0, _moment2.default)(t.start), 'seconds');
            }
        }
    }, {
        key: '_modifyTiming',
        value: function _modifyTiming(time, operation) {
            var timing = this.task.timings[this.task.timings.length - 1];
            if (!timing) {
                throw 'This task is not started, start it.';
            }

            var newStop = (0, _moment2.default)(timing.stop);
            newStop = newStop[operation](time.value, time.momentKey);

            if (operation === 'subtract' && newStop.isBefore(timing.start)) {
                throw 'You cant subtract more time';
                return;
            }

            this.task.timings[this.task.timings.length - 1].stop = newStop;
        }
    }, {
        key: 'start',
        value: function start(description) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var started = false;

                var timing = _this.task.timings[_this.task.timings.length - 1];

                if (timing && timing.start && !timing.stop) {
                    reject(_this.error('This task already started.'));
                }

                _this.task.timings.push({
                    start: (0, _moment2.default)().toDate()
                });

                _this.setDescription(description);
                _this.setStatus(_constants.IN_PROGRESS);
                _this.log('start');
                resolve();
            });
        }
    }, {
        key: 'pause',
        value: function pause() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                var timing = _this2.task.timings[_this2.task.timings.length - 1];

                if (!timing) {
                    reject(_this2.error('This task is not started, start it.'));
                }

                if (timing && timing.start && timing.stop) {
                    reject(_this2.error('This task are ended/paused, unpaused it.'));
                }

                _this2.task.timings[_this2.task.timings.length - 1].stop = (0, _moment2.default)().toDate();
                _this2.setStatus(_constants.PAUSED);
                _this2.log('pause');
                resolve();
            });
        }
    }, {
        key: 'unpause',
        value: function unpause() {
            var _this3 = this;

            return new Promise(function (resolve, reject) {
                var timing = _this3.task.timings[_this3.task.timings.length - 1];
                if (!timing) {
                    reject(_this3.error('This task is not started, start it'));
                }

                if (timing && timing.start && !timing.stop) {
                    reject(_this3.error('This task is started, pause/stop first'));
                }

                _this3.task.timings.push({
                    start: (0, _moment2.default)().toDate()
                });
                _this3.setStatus(_constants.IN_PROGRESS);
                _this3.log('unpause');
                resolve();
            });
        }
    }, {
        key: 'stop',
        value: function stop(description) {
            var _this4 = this;

            return new Promise(function (resolve, reject) {
                var timing = _this4.task.timings[_this4.task.timings.length - 1];
                if (!timing || timing && !timing.start) {
                    reject(_this4.error('This task is not started, start it'));
                }

                if (timing.start && timing.stop) {
                    reject(_this4.error('This task already ended, start/unpause it.'));
                }

                _this4.task.timings[_this4.task.timings.length - 1].stop = (0, _moment2.default)().toDate();
                _this4.setDescription(description);
                _this4.setStatus(_constants.FINISHED);
                _this4.log('stop');
                resolve();
            });
        }
    }, {
        key: 'log',
        value: function log(operation) {
            if (!this.task.log) {
                this.task.log = [];
            }

            this.task.log.push(operation + '#' + (0, _moment2.default)().toISOString());
        }
    }, {
        key: 'description',
        value: function description() {
            return this.task.description;
        }
    }, {
        key: 'setDescription',
        value: function setDescription(text) {
            this.task.description = text ? text : this.task.description ? this.task.description : '';
        }
    }, {
        key: 'setStatus',
        value: function setStatus(status) {
            this.task.status = status;
        }
    }, {
        key: 'makeOperationOverTime',
        value: function makeOperationOverTime(operation, stringTime) {
            var _this5 = this;

            return new Promise(function (resolve, reject) {
                var parsed = (0, _utils.recognizeModifierTiming)(stringTime);

                try {
                    parsed.map(function (t) {
                        _this5._modifyTiming(t, operation);
                    });
                } catch (err) {
                    console.error(err);
                    reject(_this5.error('Error trying to ' + operation + ' time to task'));
                }
                _this5.log(operation + ':' + stringTime);

                resolve();
            });
        }
    }, {
        key: 'get',
        value: function get() {
            return this.task;
        }
    }, {
        key: 'getSeconds',
        value: function getSeconds() {
            var _this6 = this;

            var duration = 0;

            if (this.task.timings) {
                this.task.timings.forEach(function (timing) {
                    duration += _this6._calcTime(timing);
                });
            } else {
                duration = this._calcTime(this.task);
            }

            return duration;
        }
    }, {
        key: 'getStartDate',
        value: function getStartDate() {
            console.log(this.task.timings);
            console.log("----------");
            if (this.task.timings && this.task.timings[0]) {
                return this.task.timings[0].start;
            } else {
                return this.task.start;
            }
        }
    }, {
        key: 'error',
        value: function error(err) {
            return err; //+ ` \n Task: ${JSON.stringify(this.task)}`
        }
    }]);

    return Task;
}();

exports.default = Task;
//# sourceMappingURL=Task.js.map