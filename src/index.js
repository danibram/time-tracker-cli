import 'babel-polyfill'

import program from 'commander'
import updateNotifier from 'update-notifier'

import Task from './Task'
import {humanParseDiff, sumarize} from './Output'
import timer from './Manager'
import pkg from '../package.json'

updateNotifier({pkg}).notify()

module.exports = function createTimer (p) {

    program
        .version(pkg.version)
        .description('Tiny time tracker for projects')

        .option('-s, --start <task> <description>', 'Start the timer task.')
        .option('-f, --finish <task> <description>', 'Stops the timer task.')
        .option('-d, --description <description>', 'Adds a descrpition for the task only in start/stop methods.')

        .option('-a, --add <task> <timeString>', 'Adds time to a task. Example: "1h2m3s"')
        .option('--remove <task> <timeString>', 'Subtract time from a task. Example: "1h2m3s"')

        .option('-l, --log <task>', 'Logs the timer task.')
        .option('-r, --report <task>', 'Report time of the tasks, searched by kay, you can report all using all as key.')
        .option('-e, --export', 'Prints the json of all tasks.')
        .parse(p.argv)

    if (program.start){
        description = program.description || program.args[0]
        timer.start(program.start, description)
    } else if (program.finish){
        description = program.description || program.args[0]
        timer.stop(program.finish, description)
        console.log(humanParseDiff(timer.getTime(program.finish)))
    } else if (program.add){
        timer.modifyTask('add', program.add, program.args[0])
        sumarize(program.add, timer.search(program.add))
    } else if (program.remove){
        timer.modifyTask('subtract', program.remove, program.args[0])
        sumarize(program.remove, timer.search(program.remove))
    } else if (program.log){
        setInterval(function() {
            process.stdout.clearLine()
            process.stdout.write(`\r Task: ${program.log} ${humanParseDiff(timer.getTime(program.log))}`)
        }, 100)
    } else if (program.report){
        sumarize(program.report, timer.search(program.report), true)
    } else if (program.export){
        console.log(JSON.stringify(timer.getTasksJson(), null, 4))
    }

}
