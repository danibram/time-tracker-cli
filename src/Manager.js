import flat from 'flat'
import Task from './Task'

import Configstore from 'configstore'
import pkg from '../package.json'

export class Manager {
    constructor(cfg) {
        this.tasks = flat(cfg.all.tasks)
    }

    getTask(name) {
        return (this.tasks[name]) ? new Task(this.tasks[name]) : new Task()
    }

    storeTasks() {
        config.set('tasks', flat.unflatten(this.tasks))
    }

    setTask(name, obj) {
        let update = {}
        update[name] = obj
        this.tasks = Object.assign({}, this.tasks, update)
    }

    start(name) {
        let t = this.getTask(name)
        t.start()
        this.storeTasks()
    }

    stop(name) {
        let t = this.getTask(name)
        t.stop()
        this.storeTasks()
    }

    getTime(name) {
        let t = this.getTask(name)
        return t.getTime()
    }
}

const config = new Configstore(pkg.name, {tasks:{}})

export default new Manager(config)
