import moment from 'moment'

import {notStarted, inProgress, finished} from './constants'

export default class Task {
    constructor(task) {
        this.start = (task.start)  ? moment(task.start) : null
        this.stop = (task.stop)  ? moment(task.stop) : null

        if (task.start && !task.stop) { this.status = inProgress }

        if (task.start && task.stop) { this.status = finished }
    }

    start() {
        if (!this.start) {
            this.start = moment()
        }
    }

    stop() {
        if (!this.stop) {
            this.stop = moment()
        }
    }

    getTime() {
        if (this.stop) {
            return this.stop.diff(this.start, 'seconds')
        } else {
            return moment().diff(this.start, 'seconds')
        }
    }
}
