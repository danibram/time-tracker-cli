import moment from 'moment'
import Table from 'cli-table'

import {humanParseDiff, recognizeModifierTiming, calcRate} from './Utils'

export const sumarize = function(search, tasks, rate, full) {
    let table = new Table({
        head: ['Duration', 'Dates', 'Task'],
        chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
        colAligns: ['right', 'center', 'left'],
        style: { head: ['green'] }
    });
    let total = 0
    let head= `Search: ${search} \n`

    tasks.map((task, index)=>{
        let duration = moment(task.task.stop).diff(moment(task.task.start), 'seconds')
        total += duration

        let outputDuration = humanParseDiff(duration)

        let name = task.name
        let startTime = moment(task.task.start).format('DD/MM/YYYY')
        let stopTime = moment(task.task.stop).format('DD/MM/YYYY')
        if (startTime !== stopTime){
            startTime = moment(task.task.start).format('DD/MM') + '|' + moment(task.task.stop).format('DD/MM YYYY')
        }
        table.push([outputDuration, startTime, name])
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
