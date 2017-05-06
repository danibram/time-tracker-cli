'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _templateObject = _taggedTemplateLiteral(['\n        timer\n        ', '\n        ', '\n    '], ['\n        timer\n        ', '\n        ', '\n    ']);

var _omelette = require('omelette');

var _omelette2 = _interopRequireDefault(_omelette);

var _constants = require('./core/constants');

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _configstore = require('configstore');

var _configstore2 = _interopRequireDefault(_configstore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var config = new _configstore2.default(_package2.default.name, {
    tasks: {},
    config: {
        'format.output': 'DD/MM'
    }
});

var autocomplete = function autocomplete() {
    var key = function key(_ref) {
        var reply = _ref.reply,
            before = _ref.before;

        var keyTasks = ['start', 'pause', 'unpause', 'finish', 'log', 'description', 'add', 'remove'];

        if (keyTasks.indexOf(before) > -1) {
            reply(Object.keys(config.all.tasks));
        }

        if (before === 'configure') {
            reply(_constants.configElements);
        }
    };

    var complete = (0, _omelette2.default)(_templateObject, ["start", "pause", "unpause", "finish", "description", "add", "subtract", "report", "log", "export", "delete", "configuration", "configure"], key);
    complete.init();

    if (~process.argv.indexOf('--setupCLI')) {
        complete.setupShellInitFile();
    }
};

exports.default = autocomplete;
//# sourceMappingURL=autocomplete.js.map