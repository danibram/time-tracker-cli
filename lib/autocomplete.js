'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _omelette = require('omelette');

var _omelette2 = _interopRequireDefault(_omelette);

var _constants = require('./core/constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var autocomplete = function autocomplete(config) {
    var taskKeys = Object.keys(config.all.tasks);

    var complete = (0, _omelette2.default)('timer <action> <tasks>');

    complete.on("action", function (_ref) {
        var reply = _ref.reply;

        reply(["start", "pause", "unpause", "finish", "description", "add", "subtract", "report", "log", "export", "delete", "configuration", "configure"]);
    });

    complete.on("tasks", function (_ref2) {
        var reply = _ref2.reply,
            before = _ref2.before;

        var keyTasks = ['start', 'pause', 'unpause', 'finish', 'log', 'description', 'add', 'remove'];

        if (keyTasks.indexOf(before) > -1) {
            reply(taskKeys);
        } else if (before === 'configure') {
            reply(_constants.configElements);
        }
    });

    complete.init();

    if (~process.argv.indexOf('--setupCLI')) {
        complete.setupShellInitFile();
    }
};

exports.default = autocomplete;
//# sourceMappingURL=autocomplete.js.map