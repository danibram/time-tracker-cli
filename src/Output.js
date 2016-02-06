import moment from 'moment'
import Table from 'cli-table'

export const humanParseDiff = function(secs) {
    let hours   = Math.floor(secs / 3600)
    let minutes = Math.floor((secs - (hours * 3600)) / 60)
    let seconds = secs - (hours * 3600) - (minutes * 60)
    hours = (hours == 0 ? '' : (hours < 10 ? '0' + hours : hours) + 'h ')
    minutes = ((minutes == 0 && hours == '') ? '' : (minutes < 10 ? '0' + minutes : minutes) + 'm ')
    seconds = (seconds == 0 ? '' : (seconds  < 10 ? '0' + seconds : seconds) + 's')
    return hours + minutes + seconds
}

export const repeatChar = function (char, times) {
    let output = ''
    for (var i = 0; i < times; i++) {
        output += char
    }
    return output
}

export const sumarize = function(search, tasks) {
    let table = new Table({
        head: ['Time', 'Start', 'Task'],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''}
    });
    let total = 0
    let head= `Search: ${search} \n`

    tasks.map((task, index)=>{
        let duration = moment(task.task.stop).diff(moment(task.task.start), 'seconds')
        total += duration

        let outputDuration = humanParseDiff(duration)

        let name = task.name
        let startTime = moment(task.task.start).format('DD/MM/YYYY')

        table.push([outputDuration, startTime, name])
    })

    console.log(table.toString());
    let table2 = new Table()
    table2.push([`Search: ${search}`, 'Total time', humanParseDiff(total)])
    console.log(table2.toString());
}
