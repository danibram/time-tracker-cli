import flat from 'flat'

import moment from 'moment'
import Configstore from 'configstore'
import pkg from '../package.json'

export class Manager {
    constructor(cfg) {
        this.tasks = cfg.all.tasks
    }

    getTask(name) {
        return (this.tasks[name]) ? this.tasks[name] : {}
    }

    storeTasks() {
        config.set('tasks', this.tasks)
    }

    setTask(name, obj) {
        let update = {}
        update[name] = obj
        this.tasks = Object.assign({}, this.tasks, update)
        this.storeTasks()
    }

    start(name, description) {
        let t = this.getTask(name)
        if (!t.start) {
            t.start = moment().toDate()
            if (description) t.description = description
            this.setTask(name, t)
        }
    }

    stop(name, description) {
        let t = this.getTask(name)
        if (!t.stop) {
            t.stop = moment().toDate()
            if (description) t.description = description
            this.setTask(name, t)
        }
    }

    getTime(name) {
        let t = this.getTask(name)
        if (t.stop) {
            return moment(t.stop).diff(moment(t.start), 'seconds')
        } else {
            return moment().diff(moment(t.start), 'seconds')
        }
    }

    search(string) {
        let keys = Object.keys(this.tasks)
        let tasks = []
        keys.map((key)=>{
            if (string === 'all' || key.indexOf(string) > -1){
                tasks.push({
                    name: key,
                    task: this.tasks[key]
                })
            }
        })
        return tasks
    }
    getTasksJson() {
        return flat.unflatten(this.tasks)
    }
}

const config = new Configstore(pkg.name, {tasks:{}})

export default new Manager(config)
