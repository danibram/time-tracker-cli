import omelette from 'omelette'
import { configElements } from './core/constants'

const autocomplete = function(config){
    const tasks = Object.keys(config.all.tasks)

    let key = ({before}) => {
        let keyTasks = ['start', 'pause', 'unpause', 'finish', 'log', 'description', 'add', 'remove']

        if (keyTasks.indexOf(before) > -1){
            return tasks
        }

        if (before === 'configure' ){
            return configElements
        }
    }

    const complete = omelette`
        timer
        ${["start", "pause", "unpause", "finish", "description", "add", "subtract", "report", "log", "export", "delete", "configuration", "configure"]}
        ${key}
    `
    complete.init()

    if (~process.argv.indexOf('--setupCLI')) {
        complete.setupShellInitFile()
    }

}

export default autocomplete
