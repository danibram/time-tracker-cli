export const humanParseDiff = function(secs) {
    let hours   = Math.floor(secs / 3600)
    let minutes = Math.floor((secs - (hours * 3600)) / 60)
    let seconds = secs - (hours * 3600) - (minutes * 60)

    return (hours < 10 ? '0' + hours : hours) + 'h ' + (minutes < 10 ? '0' + minutes : minutes) + 'm ' + (seconds  < 10 ? '0' + seconds : seconds) + 's'
}
