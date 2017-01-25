import flat from 'flat'

import Task from './Task'
import moment from 'moment'

import { recognizeModifierTiming } from './utils'
import { STARTED, PAUSED, UNPAUSED, IN_PROGRESS, FINISHED } from './constants'
import { sumarize, outputVertical, cliError } from './output'

export default class Manager {

    configElements = ['format.output']
    repositories = ['tasks', 'config']

    constructor(cfg) {
        this.cfg = cfg
        this.tasks = cfg.all.tasks
        this.config = (cfg.all.config) ? cfg.all.config : {}

        if (!this.config['config.version']){
            this.migrateToV2(this.tasks)
                .then((migratedTasks)=>{
                    this.cfg.set('tasks', migratedTasks)
                    this.cfg.set('config', Object.assign(this.config, {
                        'config.version': 2
                    }))
                }, cliError)
                .catch(cliError)
        }
    }

    getTask(key) {
        let task = (this.tasks[key]) ? this.tasks[key] : null
        return new Task(task)
    }

    storeTask(key, task){
        let update = {}
        update[key] = task.get()
        this.tasks = Object.assign({}, this.tasks, update)
        this.cfg.set('tasks', this.tasks)
    }

    startTask(key, description) {
        let t = this.getTask(key)
        t.start(description)
            .then(() => {
                this.storeTask(key, t)
                console.log(
                    outputVertical('Task:', key, STARTED, moment().toISOString())
                )
            }, cliError)
            .catch(cliError)
    }

    pauseTask(key){
        let t = this.getTask(key)
        t.pause()
            .then(()=>{
                this.storeTask(key, t)
                console.log(
                    outputVertical('Task:', key, PAUSED, moment().toISOString())
                )
            }, cliError)
            .catch(cliError)
    }

    unpauseTask(key){
        let t = this.getTask(key)
        t.unpause()
            .then(()=>{
                this.storeTask(key, t)
                console.log(
                    outputVertical('Task:', key, UNPAUSED, moment().toISOString())
                )
            }, cliError)
            .catch(cliError)
    }

    stopTask(key, description) {
        let t = this.getTask(key)
        t.stop(description)
            .then(()=>{
                this.storeTask(key, t)
                console.log(
                    outputVertical('Task:', key, FINISHED, moment().toISOString())
                )
            }, cliError)
            .catch(cliError)
    }

    addDescription(key, text){
        let t = this.getTask(key)
        t.setDescription(text)
        this.storeTask(key, t)
    }

    getTime(name) {
        let t = this.getTask(name)
        return t.getSeconds()
    }

    modifyTask(operation, name, stringTime){
        let t = this.getTask(name)
        t.makeOperationOverTime(operation, stringTime)
            .then(()=>{
                this.storeTask(name, t)
            }, cliError)
            .catch(cliError)
    }

    search(string) {
        let keys = Object.keys(this.tasks)
        let tasks = []
        keys.forEach((key)=>{
            if (string === 'all' || key.indexOf(string) > -1){
                tasks.push({
                    name: key,
                    task: new Task(this.tasks[key])
                })
            }
        })
        return tasks
    }

    getTasksJson() {
        return flat.unflatten(this.tasks)
    }

    getConfig(){
        return this.config
    }

    configure(element, value){

        if (this.configElements.indexOf(element) < 0){
            return cliError(`Config key (${element}) not allowed, allowed keys: ${this.configElements.toString()} `)
        }

        let newCfg = {
            [element]: value
        }

        this.config = Object.assign({}, this.config, newCfg)
        this.cfg.set('config', this.config)

        return this.config
    }

    migrateToV2(tasks){
        return new Promise((resolve, reject)=>{
            Object.keys(tasks).forEach(k => {
                if (!tasks[k].timings){
                    reject('Config migrated')
                }

                if (!tasks[k].start && !tasks[k].stop){
                    reject('Config corrupted or migrated')
                }

                tasks[k].timings = [{
                    start: (tasks[k].start) ? tasks[k].start : null,
                    stop: (tasks[k].stop) ? tasks[k].stop : null
                }]

                delete tasks[k].start
                delete tasks[k].stop
            })

            resolve(tasks)
        })

    }

    sumarize(key, rate, full=true){
        let tasks = this.search(key)
        sumarize(key, tasks, rate, full, this.config['format.output'])
    }
}
