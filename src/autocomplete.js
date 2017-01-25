import omelette from 'omelette'
import { configElements } from './core/constants'

const autocomplete = function(config){

    const complete = omelette("timer <cmd> <key>")

    let allTaskKeys = function() {
        this.reply(Object.keys(config.all.tasks));
    }

    complete.on("cmd", function() {
        this.reply(["start", "pause", "unpause", "finish", "description", "add", "subtract", "report", "log", "export", "delete", "configuration", "configure"])
    });

    complete.on("key", function(cmd) {
        let keyTasks = ['start', 'pause', 'unpause', 'finish', 'log', 'description', 'add', 'remove']

        if (keyTasks.indexOf(cmd) > -1){
            this.reply(Object.keys(config.all.tasks));
        }

        if (cmd === 'configure' ){
            this.reply(configElements);
        }
    });

    complete.init();

    if (~process.argv.indexOf('--setupCLI')) {
        complete.setupShellInitFile();
    }

}

export default autocomplete
