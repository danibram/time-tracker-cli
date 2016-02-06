import 'babel-polyfill'

import program from 'commander'

import Task from './Task'
import {humanParseDiff, sumarize} from './Output'
import timer from './Manager'
import pkg from '../package.json'

module.exports = function createTimer (p) {

    program
        .version(pkg.version)
        .description('Tiny time tracker for projects')
        .option('-s, --start <task>', 'Start the timer task.')
        .option('-f, --finish <task>', 'Stops the timer task.')
        .option('-d, --description <description>', 'Adds a descrpition for the task only in start/stop methods.')
        .option('-l, --log <task>', 'Logs the timer task.')
        .option('-r, --report <task>', 'Report time of the tasks, searched by kay, you can report all using all as key.')
        .option('-e, --export', 'Prints the json of all tasks.')
        .parse(p.argv)

    if (program.start) {
        timer.start(program.start, program.description)
    } else if (program.finish) {
        timer.stop(program.finish, program.description)
        console.log(humanParseDiff(timer.getTime(program.finish)))
    } else if (program.log) {
        setInterval(function() {
            process.stdout.clearLine()
            process.stdout.write(`\r Task: ${program.log} ${humanParseDiff(timer.getTime(program.log))}`)        }, 100)
    } else if (program.report) {
        sumarize(program.report, timer.search(program.report))
    } else if (program.export) {
        console.log(JSON.stringify(timer.getTasksJson(), null, 4))
    }
}
