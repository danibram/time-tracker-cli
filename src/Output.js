import moment from 'moment'

export const humanParseDiff = function(secs) {
    let hours   = Math.floor(secs / 3600)
    let minutes = Math.floor((secs - (hours * 3600)) / 60)
    let seconds = secs - (hours * 3600) - (minutes * 60)
    hours = (hours == 0 ? repeatChar(' ', 4) : (hours < 10 ? '0' + hours : hours) + 'h ')
    minutes = ((minutes == 0 && hours == '') ? repeatChar(' ', 4) : (minutes < 10 ? '0' + minutes : minutes) + 'm ')
    seconds = (seconds == 0 ? repeatChar(' ', 4) : (seconds  < 10 ? '0' + seconds : seconds) + 's')
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
    let output = ''
    let total = 0
    output += `Search: ${search} \n`
    output += ` ─┐ \n`
    tasks.map((task, index)=>{
        let duration = moment(task.task.stop).diff(moment(task.task.start), 'seconds')
        total += duration

        let outputDuration = humanParseDiff(duration)

        let name = task.name
        let startTime = moment(task.task.start).format('DD/MM/YYYY')

        let time = `${outputDuration} (${startTime}) ${name}`
        output += '  ├──> ' + time + '\n'
    })
    output += `  │ \n`
    output += `  └──> ${humanParseDiff(total)} (Total time)\n`
    process.stdout.write(output)
}
