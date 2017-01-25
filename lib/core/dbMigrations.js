"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var migrateToV2 = exports.migrateToV2 = function migrateToV2(tasks) {
    var promises = [];
    var migrate = function migrate(key, task) {
        return new Promise(function (resolve, reject) {

            var timing = {};
            var update = false;

            if (task.start) {
                update = true;
                timing.start = task.start;
                delete task.start;
            }

            if (task.stop) {
                timing.stop = task.stop;
                delete task.stop;
            }

            if (update) {
                task.timings = [timing];
            }

            resolve({
                key: key,
                task: task
            });
        });
    };

    Object.keys(tasks).forEach(function (k) {
        return promises.push(migrate(k, tasks[k]));
    });

    return Promise.all(promises);
};
//# sourceMappingURL=dbMigrations.js.map