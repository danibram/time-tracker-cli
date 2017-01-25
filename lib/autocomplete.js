"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _omelette = require("omelette");

var _omelette2 = _interopRequireDefault(_omelette);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var autocomplete = function autocomplete(config) {

    var complete = (0, _omelette2.default)("timer <cmd> <key>");

    var allTaskKeys = function allTaskKeys() {
        this.reply(Object.keys(config.all.tasks));
    };

    complete.on("cmd", function () {
        this.reply(["start", "pause", "unpause", "finish", "description", "add", "remove", "report", "log", "export"]);
    });

    complete.on("key", function (cmd) {
        var keyTasks = ['start', 'pause', 'unpause', 'finish', 'log', 'description', 'add', 'remove'];

        if (keyTasks.indexOf(cmd) > -1) {
            this.reply(Object.keys(config.all.tasks));
        }
    });

    complete.init();

    if (~process.argv.indexOf('--setupCLI')) {
        complete.setupShellInitFile();
    }
};

exports.default = autocomplete;
//# sourceMappingURL=autocomplete.js.map