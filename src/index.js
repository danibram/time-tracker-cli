import 'babel-polyfill'

import program from 'commander'

import Task from './Task'
import {humanParseDiff} from './Output'
import Manager from './Manager'
import pkg from '../package.json'

moduleexports = function(p) {
    let timer = Manager()

    program
        .version(pkg.version)
        .option('-s, --start <task>', 'Start the timer task.')
        .option('-h, --stop <task>', 'Stops the timer task.')
        .option('-l, --log <task>', 'Logs the timer task.')
        .parse(p.argv)

    if (program.start) {
        timer.start(program.start)
    } else if (program.stop) {
        timer.stop(program.stop)
        console.log(humanParseDiff(timer.getTime(program.stop)))
    } else if (program.log) {
        setInterval(function() {
            process.stdout.clearLine()
            process.stdout.write(`Task: ${program.log} ${humanParseDiff(timer.getTime(program.log))}`)        }, 100)
    }
}
