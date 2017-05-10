import omelette from 'omelette'
import { configElements } from './core/constants'

const autocomplete = function(config){
    let taskKeys = Object.keys(config.all.tasks)

    const complete = omelette('timer <action> <tasks>')

    complete.on("action",({ reply }) => {
        reply(["start", "pause", "unpause", "finish", "description", "add", "subtract", "report", "log", "export", "delete", "configuration", "configure"]);
    });

    complete.on("tasks", ({ reply, before }) =>{
        let keyTasks = ['start', 'pause', 'unpause', 'finish', 'log', 'description', 'add', 'remove']

        if (keyTasks.indexOf(before) > -1){
            reply(taskKeys)
        } else if (before === 'configure' ){
            reply(configElements)
        }
    })

    complete.init()

    if (~process.argv.indexOf('--setupCLI')) {
        complete.setupShellInitFile()
    }
}

export default autocomplete
