import moment from 'moment'
import Table from 'cli-table2'
import colors from 'colors'

import { humanParseDiff, calcRate } from './utils'

export const sumarize = function(search, tasks, rate, full, format) {
    let table = new Table({
        head: ['Task', 'Dates', 'Duration'],
        colAligns: ['right', 'center', 'left'],
        chars: {
            'top': '═'
            , 'top-mid': '╤'
            , 'top-left': '╔'
            , 'top-right': '╗'
            , 'bottom': '═'
            , 'bottom-mid': '╧'
            , 'bottom-left': '╚'
            , 'bottom-right': '╝'
            , 'left': '║'
            , 'left-mid': '╟'
            , 'right': '║'
            , 'right-mid': '╢'
          },
        style: { head: ['green'] }
    });
    let total = 0
    let head= `Search: ${search} \n`

    tasks.forEach((task, index) => {
		let description = (task.task.description() && task.task.description() !== '')
		? task.task.description()
		: task.name
        task = task.task

        let duration = task.getSeconds()
        total += duration

        table.push([description, moment(task.getStartDate()).format(format), humanParseDiff(duration)])
    })

    if (full){
        table.push([])

        if (rate){
            table.push(
                [{ rowSpan:2, content: `${colors.red('Search:')} "${search}"`, vAlign:'center'}, colors.red('Total time'), humanParseDiff(total)],
                [ colors.red('Rate'), calcRate(rate, total)]
            )
        } else {
            table.push(
                [
                    { rowSpan:2, content: `${colors.red('Search:')} "${search}"`, vAlign:'center' },
                    { rowSpan:2, content: colors.red('Total time'), vAlign:'center' },
                    { rowSpan:2, content: humanParseDiff(total), vAlign:'center' }
                ],
                []
            )
        }
    }

    console.log(table.toString());
}

export const outputConfig = function (config){
    let table = new Table({
        head: ['Key', 'value'],
        chars: {
            'top': '═'
            , 'top-mid': '╤'
            , 'top-left': '╔'
            , 'top-right': '╗'
            , 'bottom': '═'
            , 'bottom-mid': '╧'
            , 'bottom-left': '╚'
            , 'bottom-right': '╝'
            , 'left': '║'
            , 'left-mid': '╟'
            , 'right': '║'
            , 'right-mid': '╢'
        },
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
    console.error(colors.red(`Error: ${err}`))
}

export const cliSuccess = function(err) {
    console.log(colors.green(err))
}
