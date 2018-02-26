import moment from 'moment'
import Table from 'cli-table2'
import colors from 'colors'

import { humanParseDiff, calcRate, getSeconds } from './utils'

export const sumarize = function(search, tasks, rate, full, format) {
    let table = new Table({
        head: ['Name', 'Description', 'Dates', 'Duration'],
        colAligns: ['left', 'center', 'center', 'left'],
        chars: {
            top: '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            bottom: '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            left: '║',
            'left-mid': '╟',
            right: '║',
            'right-mid': '╢'
        },
        style: { head: ['green'] }
    })
    let total = 0
    let head = `Search: ${search} \n`

    tasks.forEach((task, index) => {
        let description =
            task.task.description() && task.task.description() !== ''
                ? task.task.description()
                : '-'
        let name = task.name
        task = task.task

        let duration = task.getSeconds()
        total += duration

        // Avoid excesive width for proper console fit
        let splitWidth = (str, len) => {
            let arr = []
            while (str != '') {
                if (str.length > len) {
                    arr.push(str.substring(0, len))
                    str = str.substring(len)
                } else {
                    arr.push(str)
                    break
                }
            }
            return arr.join('\n')
        }
        description = splitWidth(description, 51)
        name = splitWidth(name, 40)

        table.push([
            name,
            description,
            moment(task.getStartDate()).format(format),
            humanParseDiff(duration)
        ])
    })

    if (full) {
        table.push([])

        if (rate) {
            table.push(
                [
                    {
                        rowSpan: 2,
                        content: `${colors.red('Search:')} "${search}"`,
                        vAlign: 'center'
                    },
                    colors.red('Total time'),
                    humanParseDiff(total)
                ],
                [colors.red('Rate'), calcRate(rate, total)]
            )
        } else {
            table.push(
                [
                    {
                        rowSpan: 2,
                        content: `${colors.red('Search:')} "${search}"`,
                        vAlign: 'center'
                    },
                    { rowSpan: 2, content: '', vAlign: 'center' },
                    {
                        rowSpan: 2,
                        content: colors.red('Total time'),
                        vAlign: 'center'
                    },
                    {
                        rowSpan: 2,
                        content: humanParseDiff(total),
                        vAlign: 'center'
                    }
                ],
                []
            )
        }
    }

    console.log(table.toString())
}

export const outputConfig = function(config) {
    let table = new Table({
        head: ['Key', 'value'],
        chars: {
            top: '═',
            'top-mid': '╤',
            'top-left': '╔',
            'top-right': '╗',
            bottom: '═',
            'bottom-mid': '╧',
            'bottom-left': '╚',
            'bottom-right': '╝',
            left: '║',
            'left-mid': '╟',
            right: '║',
            'right-mid': '╢'
        },
        colAligns: ['center', 'center'],
        style: { head: ['green'] }
    })

    Object.keys(config).map(e => table.push([e, config[e]]))

    console.log(table.toString())
}

export const outputVertical = function(...args) {
    let table2 = new Table()
    let key = args.splice(0, 1)
    table2.push({ [key]: args })

    return table2.toString()
}

export const cliError = function(err) {
    console.error(colors.red(`Error: ${err}`))
}

export const cliSuccess = function(err) {
    console.log(colors.green(err))
}

export const markdown = function(tasks, expanded = false) {
    let body = '| Start | End | Hours | Subtotal | Description |\n'
    body += '| ----- | --- | -----:| -------: | ----------- |\n'
    let total = 0

    //tasks = start || end ? this.filterDates(tasks, start, end) : tasks;
    tasks.forEach(task => {
        let name = task.name
        task = task.task

        if (!task.filtered) {
            let duration = task.getSeconds()
            total += duration

            if (expanded && task.task.timings.length > 1) {
                let subtotal = 0
                let times = 0

                task.task.timings.forEach(timing => {
                    let secs = getSeconds(timing)
                    subtotal += secs
                    times += 1
                    body +=
                        `|${moment(timing.start).format('YYYY/MM/DD kk:mm')}` +
                        `|${moment(timing.stop).format('YYYY/MM/DD kk:mm')}` +
                        `|${humanParseDiff(secs)}` +
                        `|${humanParseDiff(subtotal)}` +
                        `|${name} (part ${times})` +
                        `|\n`
                })
            } else {
                let start = task.getStartDate()
                let stop = task.getEndDate()

                body +=
                    `|${moment(start).format('YYYY/MM/DD kk:mm')}` +
                    `|${moment(stop).format('YYYY/MM/DD kk:mm')}` +
                    `|${humanParseDiff(duration)}` +
                    `|${humanParseDiff(total)}` +
                    `|${name}` +
                    `|\n`
            }
        }
    })
    body += '| | | |\n'
    body += `| Total | | ${humanParseDiff(total)} | | |\n`

    return body
}
