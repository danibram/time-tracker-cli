'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _templateObject = _taggedTemplateLiteral(['\n        timer\n        ', '\n        ', '\n    '], ['\n        timer\n        ', '\n        ', '\n    ']);

var _omelette = require('omelette');

var _omelette2 = _interopRequireDefault(_omelette);

var _constants = require('./core/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var autocomplete = function autocomplete(config) {
    var tasks = Object.keys(config.all.tasks);

    var key = function key(_ref) {
        var before = _ref.before;

        var keyTasks = ['start', 'pause', 'unpause', 'finish', 'log', 'description', 'add', 'remove'];

        if (keyTasks.indexOf(before) > -1) {
            return tasks;
        }

        if (before === 'configure') {
            return _constants.configElements;
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