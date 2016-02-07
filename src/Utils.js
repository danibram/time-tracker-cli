export const recognizeModifierTiming = function (string){
    let r = /(\d{1,})([hms])/g
    let arr
    let res = []
    while ((arr = r.exec(string)) !== null) {
        res.push({
            value: arr[1],
            momentKey: arr[2]
        })
    }
    return res
}

export const humanParseDiff = function(secs) {
    let hours   = Math.floor(secs / 3600)
    let minutes = Math.floor((secs - (hours * 3600)) / 60)
    let seconds = secs - (hours * 3600) - (minutes * 60)
    hours = (hours == 0 ? '' : (hours < 10 ? '0' + hours : hours) + 'h ')
    minutes = ((minutes == 0 && hours == '') ? '' : (minutes < 10 ? '0' + minutes : minutes) + 'm ')
    seconds = (seconds == 0 ? '' : (seconds  < 10 ? '0' + seconds : seconds) + 's')
    return hours + minutes + seconds
}
