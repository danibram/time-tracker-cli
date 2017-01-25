import 'babel-polyfill'

import program from 'commander'
import updateNotifier from 'update-notifier'
import Configstore from 'configstore'
import pkg from '../package.json'

import Manager from './core/Manager'
import { humanParseDiff } from './core/utils'
import { outputVertical, cliError } from './core/output'

import autocomplete from './autocomplete'

const config = new Configstore(pkg.name, {
    tasks:{},
    config:{
        'format.output': 'DD/MM',
        'config.version': '2'
    }
})

updateNotifier({ pkg }).notify()

const manager = new Manager(config)
autocomplete(config)

//Exec
let EXEC = false

program
    .version(pkg.version)
    .description('Tiny time tracker for projects')

program
    .command('start <task_key> [description]')
    .description('Start task with a description.')
    .alias('s')
    .action(function(key, description) {
        description = (description) ? Array.isArray(description) ? description.join(' ') : description : null
        manager.startTask(key, description)
        EXEC = true
    })

program
    .command('pause <task_key>')
    .description('Pause task')
    .alias('p')
    .action(function(key) {
        manager.pauseTask(key)
        EXEC = true
    })

program
    .command('unpause <task_key>')
    .description('Unpause task')
    .alias('up')
    .action(function(key) {
        manager.unpauseTask(key)
        EXEC = true
    })


program
    .command('finish <task_key> [description]')
    .description('Stop task, you can add a description')
    .alias('f')
    .action(function(key, description) {
        manager.stopTask(key, description)
        EXEC = true
    })

program
    .command('description <task_key> <descriptionText...>')
    .description('Add description to your task.')
    .alias('d')
    .action(function(key, text) {
        text = Array.isArray(text) ? text.join(' ') : text
        manager.addDescription(key, text)
        EXEC = true
    })

program
    .command('add <task_key> <stringTime>')
    .description('Adds time to a task. Example: "1h2m3s"')
    .action(function(key, stringTime) {
        manager.modifyTask('add', key, stringTime)
        manager.sumarize(key, manager.search(key), false)
        EXEC = true
    })

program
    .command('remove <task_key> <stringTime>')
    .description('Subtract time to a task. Example: "1h2m3s"')
    .alias('sub')
    .action(function(key, stringTime) {
        manager.modifyTask('subtract', key, stringTime)
        manager.sumarize(key, manager.search(key), false)
        EXEC = true
    })

program
    .command('report [tasks] [rate]')
    .description('Report time of the tasks, searched by key. Can pass a rate (1h).')
    .alias('r')
    .action(function(tasks, rate) {
        tasks = (tasks) ? tasks : 'all'
        manager.sumarize(tasks, rate)
        EXEC = true
    })



program
    .command('log <task_key>')
    .description('Logs the time of the  task')
    .alias('l')
    .action(function(key) {
        setInterval(() => {
            let text = outputVertical('Task:', key, humanParseDiff(manager.getTime(key)))
            process.stdout.write(text)
            process.stdout.moveCursor(0,-2)
        }, 1000)
        EXEC = true
    })

program
    .command('export')
    .description('Export the tasks in a JSON')
    .alias('e')
    .action(function(key) {
        console.log(JSON.stringify(manager.getTasksJson(), null, 4))
        EXEC = true
    })

program
    .parse(process.argv);

if (program.args.length === 0 || !EXEC) {
    cliError('You must use a valid command.')
    program.outputHelp()
    process.exit(1)
}
