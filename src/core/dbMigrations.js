export const migrateToV2 = function (tasks){
    let promises = []
    let migrate = (key, task) => new Promise((resolve, reject) => {

        let timing = {}
        let update = false

        if (task.start) {
            update = true
            timing.start = task.start
            delete task.start
        }

        if (task.stop) {
            timing.stop = task.stop
            delete task.stop
        }

        if (update) {
            task.timings = [timing]
        }

        resolve({
            key,
            task
        })
    })

    Object.keys(tasks).forEach(k => promises.push( migrate(k, tasks[k]) ))

    return Promise.all(promises)
}
