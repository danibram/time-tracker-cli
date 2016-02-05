'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var humanParseDiff = exports.humanParseDiff = function humanParseDiff(secs) {
    var hours = Math.floor(secs / 3600);
    var minutes = Math.floor((secs - hours * 3600) / 60);
    var seconds = secs - hours * 3600 - minutes * 60;

    return (hours < 10 ? '0' + hours : hours) + 'h ' + (minutes < 10 ? '0' + minutes : minutes) + 'm ' + (seconds < 10 ? '0' + seconds : seconds) + 's';
};
//# sourceMappingURL=Output.js.map