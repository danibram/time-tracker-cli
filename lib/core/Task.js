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

var _constants2 = require('constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Task = function () {
    function Task(task) {
        _classCallCheck(this, Task);

        this.task = task ? task : {
            description: '',
            timings: []
        };
        this.filtered = false;
    }

    _createClass(Task, [{
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
        key: 'filterByDates',
        value: function filterByDates(start, end) {
            if (this.task.timings) {
                if (start && end) {
                    this.task.timings = this._filterTimingsByDate(start, end);
                } else if (start) {
                    end = (0, _moment2.default)().format('YYYY/MM/DD');
                    this.task.timings = this._filterTimingsByDate(start, end);
                } else if (end) {
                    start = (0, _moment2.default)(0).format('YYYY/MM/DD');
                    this.task.timings = this._filterTimingsByDate(start, end);
                }

                if (this.task.timings.length === 0) {
                    this.filtered = true;
                }
            } else {
                var t = (0, _utils.inPeriod)(this.task.start, this.task.stop, start, end);
                if (t.isBetween) {
                    this.task.start = t.start;
                    this.task.stop = t.stop;
                } else {
                    this.filtered = true;
                }
            }

            return this;
        }
    }, {
        key: '_filterTimingsByDate',
        value: function _filterTimingsByDate(start, end) {
            return this.task.timings.reduce(function (acc, val) {
                console.log(val);
                var t = (0, _utils.inPeriod)(val.start, val.stop, start, end);
                console.log(t);
                if (t.isBetween) {
                    acc.push({
                        start: t.start,
                        stop: t.stop
                    });
                }
                return acc;
            }, []);
        }
    }, {
        key: 'getSeconds',
        value: function getSeconds() {
            var duration = 0;

            if (this.task.timings) {
                this.task.timings.forEach(function (timing) {
                    duration += (0, _utils.getSeconds)(timing);
                });
            } else {
                duration = (0, _utils.getSeconds)(this.task);
            }

            return duration;
        }
    }, {
        key: 'getStartDate',
        value: function getStartDate() {
            if (this.task.timings && this.task.timings[0]) {
                return this.task.timings[0].start;
            } else {
                return this.task.start;
            }
        }
    }, {
        key: 'getEndDate',
        value: function getEndDate() {
            if (this.task.timings) {
                return this.task.timings[this.task.timings.length - 1].stop;
            } else if (this.task.stop) {
                return this.task.stop;
            } else {
                return (0, _moment2.default)().toDate();
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