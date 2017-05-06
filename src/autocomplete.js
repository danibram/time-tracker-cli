import omelette from 'omelette'
import { configElements } from './core/constants'

import pkg from '../package.json'
import Configstore from 'configstore'

const config = new Configstore(pkg.name, {
    tasks:{},
    config:{
        'format.output': 'DD/MM'
    }
})

const autocomplete = function(){
    let key = ({reply, before}) => {
        let keyTasks = ['start', 'pause', 'unpause', 'finish', 'log', 'description', 'add', 'remove']

        if (keyTasks.indexOf(before) > -1){
            reply(Object.keys(config.all.tasks))
        }

        if (before === 'configure' ){
            reply(configElements)
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
