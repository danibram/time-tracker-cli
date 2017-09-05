import moment from 'moment'

import { STARTED, PAUSED, IN_PROGRESS, FINISHED } from './constants'
import { recognizeModifierTiming } from './utils'
import { cliError } from './output'


export default class Task {
    constructor(task){
        this.task = (task) ? task : {
            description: '',
            timings: []
        }
    }

    _calcTime(t){
        if (t.stop) {
            return moment(t.stop).diff(moment(t.start), 'seconds')
        } else {
            return moment().diff(moment(t.start), 'seconds')
        }
    }

    _modifyTiming(time, operation){
        let timing = this.task.timings[this.task.timings.length - 1]
        if (!timing){
            throw (`This task is not started, start it.`)
        }

        let newStop = moment(timing.stop)
        newStop = newStop[operation](time.value, time.momentKey)

        if (operation === 'subtract' && newStop.isBefore(timing.start)){
            throw('You cant subtract more time')
            return
        }

        this.task.timings[this.task.timings.length - 1].stop = newStop
    }

    start(description){
        return new Promise((resolve, reject)=>{
            let started = false

            let timing = this.task.timings[this.task.timings.length - 1]

            if (timing && timing.start && !timing.stop) {
                reject(this.error(`This task already started.`))
            }

            this.task.timings.push({
                start: moment().toDate()
            })

            this.setDescription(description)
            this.setStatus(IN_PROGRESS)
            this.log('start')
            resolve()
        })
    }

    pause(){
        return new Promise((resolve, reject)=>{
            let timing = this.task.timings[this.task.timings.length - 1]

            if (!timing){
                reject(this.error(`This task is not started, start it.`))
            }

            if (timing && timing.start && timing.stop) {
                reject(this.error(`This task are ended/paused, unpaused it.`))
            }

            this.task.timings[this.task.timings.length - 1].stop = moment().toDate()
            this.setStatus(PAUSED)
            this.log('pause')
            resolve()
        })
    }

    unpause(){
        return new Promise((resolve, reject)=>{
            let timing = this.task.timings[this.task.timings.length - 1]
            if (!timing){
                reject(this.error(`This task is not started, start it`))
            }

            if (timing && timing.start && !timing.stop) {
                reject(this.error(`This task is started, pause/stop first`))
            }

            this.task.timings.push({
                start: moment().toDate()
            })
            this.setStatus(IN_PROGRESS)
            this.log('unpause')
            resolve()
        })
    }

    stop (description){
        return new Promise((resolve, reject)=>{
            let timing = this.task.timings[this.task.timings.length - 1]
            if (!timing || timing && !timing.start){
                reject(this.error(`This task is not started, start it`))
            }

            if (timing.start && timing.stop) {
                reject(this.error(`This task already ended, start/unpause it.`))
            }

            this.task.timings[this.task.timings.length - 1].stop = moment().toDate()
            this.setDescription(description)
            this.setStatus(FINISHED)
            this.log('stop')
            resolve()
        })
    }

    log(operation){
        if (!this.task.log){
            this.task.log = []
        }

        this.task.log.push(`${operation}#${moment().toISOString()}`)
    }

    description(){
        return this.task.description
    }

    setDescription(text){
        this.task.description = (text) ? text : (this.task.description) ? this.task.description : ''
    }

    setStatus(status){
        this.task.status = status
    }

    makeOperationOverTime(operation, stringTime) {
        return new Promise((resolve, reject) => {
            let parsed = recognizeModifierTiming(stringTime)

            try {
                parsed.map((t)=>{
                    this._modifyTiming(t, operation)
                })
            } catch(err){
                console.error(err)
                reject(this.error(`Error trying to ${operation} time to task`))
            }
            this.log(`${operation}:${stringTime}`)

            resolve()
        })
    }

    get(){
        return this.task
    }

    getSeconds(){
        let duration = 0

        if (this.task.timings){
            this.task.timings.forEach(timing => {
                duration += this._calcTime(timing)
            })
        } else {
            duration = this._calcTime(this.task)
        }

        return duration
    }

    getStartDate(){
        if (this.task.timings){
            return this.task.timings[0].start
        } else {
            return this.task.start
        }
    }

    error(err){
        return err //+ ` \n Task: ${JSON.stringify(this.task)}`
    }
}
