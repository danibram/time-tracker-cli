import flat from 'flat'
import moment from 'moment'
import inquirer from 'inquirer'

import Task from './Task'
import { recognizeModifierTiming, humanParseDiff, getSeconds } from './utils'
import {
    STARTED,
    PAUSED,
    UNPAUSED,
    IN_PROGRESS,
    FINISHED,
    configElements
} from './constants'
import {
    sumarize,
    outputVertical,
    cliError,
    cliSuccess,
    markdown
} from './output'
import { migrateToV2 } from './dbMigrations'

export default class Manager {
    repositories = ['tasks', 'config']

    constructor(cfg) {
        this.cfg = cfg
        this.tasks = cfg.all.tasks
        this.config = cfg.all.config ? cfg.all.config : {}
    }

    getTask(key) {
        let task = this.tasks[key] ? this.tasks[key] : null
        return new Task(task)
    }

    storeTask(key, task) {
        let update = {}
        update[key] = task.get()
        this.tasks = Object.assign({}, this.tasks, update)
        this.cfg.set('tasks', this.tasks)
    }

    startTask(key, description) {
        let t = this.getTask(key)
        t
            .start(description)
            .then(() => {
                this.storeTask(key, t)
                console.log(
                    outputVertical(
                        'Task:',
                        key,
                        STARTED,
                        moment().toISOString()
                    )
                )
            }, cliError)
            .catch(cliError)
    }

    pauseTask(key) {
        let t = this.getTask(key)
        t
            .pause()
            .then(() => {
                this.storeTask(key, t)
                console.log(
                    outputVertical('Task:', key, PAUSED, moment().toISOString())
                )
            }, cliError)
            .catch(cliError)
    }

    unpauseTask(key) {
        let t = this.getTask(key)
        t
            .unpause()
            .then(() => {
                this.storeTask(key, t)
                console.log(
                    outputVertical(
                        'Task:',
                        key,
                        UNPAUSED,
                        moment().toISOString()
                    )
                )
            }, cliError)
            .catch(cliError)
    }

    stopTask(key, description) {
        let t = this.getTask(key)
        t
            .stop(description)
            .then(() => {
                this.storeTask(key, t)
                console.log(
                    outputVertical(
                        'Task:',
                        key,
                        FINISHED,
                        moment().toISOString()
                    )
                )
            }, cliError)
            .catch(cliError)
    }

    addDescription(key, text) {
        let t = this.getTask(key)
        t.setDescription(text)
        this.storeTask(key, t)
    }

    getTime(name) {
        let t = this.getTask(name)
        return t.getSeconds()
    }

    modifyTask(operation, name, stringTime) {
        let t = this.getTask(name)
        t
            .makeOperationOverTime(operation, stringTime)
            .then(() => {
                this.storeTask(name, t)
            }, cliError)
            .catch(cliError)
    }

    search(string = 'all') {
        let keys = Object.keys(this.tasks)
        let tasks = []
        keys.forEach(key => {
            if (string === 'all' || key.indexOf(string) > -1) {
                tasks.push({
                    name: key,
                    task: new Task(this.tasks[key])
                })
            }
        })
        return tasks
    }

    delete(string) {
        let tasks = this.search(string)

        console.log(tasks.map(k => `${k.name} \n`).join(''))

        if (tasks.length === 0) {
            cliSuccess('No tasks found to delete.')
            return
        }

        inquirer
            .prompt([
                {
                    type: 'confirm',
                    name: 'cls',
                    message: `Are you sure you want to delete this tasks?`,
                    default: false
                }
            ])
            .then(answers => {
                if (answers.cls) {
                    tasks.forEach(k => {
                        delete this.tasks[k.name]
                        this.cfg.set('tasks', this.tasks)
                    })
                    cliSuccess('Tasks deleted.')
                }
            })
            .catch(cliError)
    }

    getTasksJson(key) {
        return flat.unflatten(key ? this.tasks[key] : this.tasks)
    }

    getTasksMd(key, start, end, expanded) {
        let tasks
        if (key) {
            tasks = this.search(key)
        } else {
            tasks = this.search()
        }

        tasks.map(task => {
            if (start || end) {
                task = task.task.filterByDates(start, end)
            }
            return task
        })

        return markdown(tasks, expanded)
    }

    getConfig() {
        return this.config
    }

    configure(element, value) {
        if (configElements.indexOf(element) < 0) {
            return cliError(
                `Config key (${element}) not allowed, allowed keys: ${this.configElements.toString()} `
            )
        }

        let newCfg = {
            [element]: value
        }

        this.config = Object.assign({}, this.config, newCfg)
        this.cfg.set('config', this.config)

        return this.config
    }

    update() {
        if (
            !this.config ||
            (this.config && this.config['config.version'] !== '2')
        ) {
            console.log('DB: Need to be updated')

            migrateToV2(this.tasks)
                .then(tasks => {
                    let newTasks = {}
                    tasks.forEach(t => (newTasks[t.key] = t.task))
                    return newTasks
                })
                .then(migratedTasks => {
                    this.cfg.set('tasks', migratedTasks)
                    this.cfg.set(
                        'config',
                        Object.assign(this.config, {
                            'config.version': '2'
                        })
                    )

                    cliSuccess('Configuration migrated to version 2.')
                }, cliError)
                .catch(cliError)
        } else {
            cliSuccess('No need to update the DB.')
        }
    }

    sumarize(key, rate, full = true) {
        let tasks = this.search(key)
        tasks.sort((a, b) => {
            return a.name > b.name
        })
        sumarize(key, tasks, rate, full, this.config['format.output'])
    }
}
