'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Manager = require('./core/Manager');

var _Manager2 = _interopRequireDefault(_Manager);

var _configstore = require('configstore');

var _configstore2 = _interopRequireDefault(_configstore);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = new _configstore2.default(_package2.default.name, {
    tasks: {},
    config: {
        'format.output': 'DD/MM'
    }
});

exports.default = function () {
    return new _Manager2.default(config);
};
//# sourceMappingURL=exports.js.map