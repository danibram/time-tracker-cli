import moment from 'moment'
import Table from 'cli-table'
import chalk from 'chalk'

import { humanParseDiff, calcRate } from './utils'

export const sumarize = function(search, tasks, rate, full, format) {
    let table = new Table({
        head: ['Duration', 'Dates', 'Task'],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
        colAligns: ['right', 'center', 'left'],
        style: { head: ['green'] }
    });
    let total = 0
    let head= `Search: ${search} \n`

    tasks.forEach((task, index) => {
        let name = task.name
        task = task.task

        let duration = task.getSeconds()
        total += duration

        table.push([humanParseDiff(duration), moment(task.getStartDate()).format(format), name])
    })

    console.log(table.toString());

    if (full){
        let table2 = new Table()
        table2.push(
            { 'Search': ['\"' + search + '\"'] },
            { 'Total time': [humanParseDiff(total)] }
        )

        if (rate){
            table2.push({ 'Rate': [calcRate(rate, total)] })
        }

        console.log(table2.toString());
    }
}

export const outputConfig = function (config){
    let table = new Table({
        head: ['Key', 'value'],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
        colAligns: ['center', 'center'],
        style: { head: ['green'] }
    });

    Object.keys(config).map(e => table.push([e, config[e]]))

    console.log(table.toString());
}

export const outputVertical = function (...args){
    let table2 = new Table()
        let key = args.splice(0, 1)
        table2.push(
            { [key]: args },
        )

        return table2.toString()
}

export const cliError = function(err) {
    console.error(chalk.red(`Error: ${err}`))
}

export const cliSuccess = function(err) {
    console.log(chalk.green(err))
}
