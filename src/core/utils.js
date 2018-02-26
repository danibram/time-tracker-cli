import moment from 'moment'

export const recognizeModifierTiming = function(string) {
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

export const calcRate = function(rate, total) {
    let amount
    let mod = rate.substr(rate.length - 1)
    let value = rate.slice(0, rate.length - 1)

    switch (mod) {
        case 'h':
            amount = total / 60 / 60 * parseFloat(value)
            break
        case 'm':
            amount = total / 60 * parseFloat(value)
            break
        case 's':
            amount = total * parseFloat(value)
            break
    }

    return amount.toFixed(2)
}

export const humanParseDiff = function(secs) {
    let hours = Math.floor(secs / 3600)
    let minutes = Math.floor((secs - hours * 3600) / 60)
    let seconds = secs - hours * 3600 - minutes * 60
    hours = hours == 0 ? '00h' : (hours < 10 ? '0' + hours : hours) + 'h'
    minutes =
        minutes == 0 && hours == ''
            ? '00m'
            : (minutes < 10 ? '0' + minutes : minutes) + 'm'
    seconds =
        seconds == 0 ? '00s' : (seconds < 10 ? '0' + seconds : seconds) + 's'
    return `${hours} ${minutes} ${seconds}`
}

export const inPeriod = function(start, stop, fstart, fstop) {
    fstart = moment(fstart, 'YYYY/MM/DD')
    fstop = moment(fstop, 'YYYY/MM/DD')

    if (
        moment(start).isBetween(fstart, fstop, null, '[]') &&
        moment(stop).isBetween(fstart, fstop, null, '[]')
    ) {
        return { isBetween: true, start, stop }
    }

    if (
        !moment(start).isBetween(fstart, fstop, null, '[]') &&
        moment(stop).isBetween(fstart, fstop, null, '[]')
    ) {
        return { isBetween: true, start: fstart, stop }
    }

    if (
        moment(start).isBetween(fstart, fstop, null, '[]') &&
        !moment(stop).isBetween(fstart, fstop, null, '[]')
    ) {
        return { isBetween: true, start, stop: fstop }
    }

    return { isBetween: false, start, stop }
}

export const getSeconds = ({ start, stop }) => {
    if (stop) {
        return moment(stop).diff(moment(start), 'seconds')
    } else {
        return moment().diff(moment(start), 'seconds')
    }
}
