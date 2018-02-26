# Tiny Time tracker

[![Greenkeeper badge](https://badges.greenkeeper.io/danibram/time-tracker-cli.svg)](https://greenkeeper.io/)
[![NPM](https://nodei.co/npm/time-tracker-cli.png?downloads=true)][npm-home-module]

[![npm version](https://img.shields.io/npm/v/time-tracker-cli.svg?style=flat-square)](https://github.com/danibram/time-tracker-cli)

[![Dependency Status](https://img.shields.io/bithound/dependencies/github/danibram/time-tracker-cli.svg?style=flat-square)](https://www.bithound.io/github/danibram/time-tracker-cli)
[![Support link][paypal-badge]][paypal-link]

## Installation

```
npm install -g time-tracker-cli
```

or

```
yarn global add time-tracker-cli
```

Now you can start to call `timer`command

## Usage

[![asciicast](https://asciinema.org/a/100679.png)](https://asciinema.org/a/100679)

```
└┘#! timer

  Usage: timer [options] [command]

  Tiny time tracker for projects


  Options:

    -V, --version  output the version number
    --updateDB     Bool to update the db
    -h, --help     output usage information


  Commands:

    start|s <task_key> [description]               Start task with a description.
    pause|p <task_key>                             Pause task
    unpause|up <task_key>                          Unpause task
    finish|f <task_key> [description]              Stop task, you can add a description
    description|d <task_key> <descriptionText...>  Add description to your task.
    add <task_key> <stringTime>                    Adds time to a task. Example: "1h2m3s"
    subtract|sub <task_key> <stringTime>           Subtract time to a task. Example: "1h2m3s"
    report|r [task_string] [rate]                  Report time of the tasks, empty for select all tasks. Can pass a rate (1h).
    log|l <task_key>                               Logs the time of the task
    export|e [options] [task_string]               Export the tasks in json (default) or md format
    delete|del [task_string]                       Remove tasks from the list. Empty for select all tasks
    configure <key> <value>                        Configure the value of the config passing a key
    configuration                                  Output configuration
```

* To start a task run:

```
$ timer start <key of the task> <description>
```

* To finish a task run:

```
$ timer finish <key of the task> <description>
```

* You can add a description adding:

```
$ timer description <key of the task> <description>
```

* You can also see the timer running:

```
$ timer log <key of the task>
```

## How it works

The data are stored inside ~/.config/time-tracker-cli.json
The config need to be updated if you have the 1.x to the 2.x to do that, to update config run timer --updateDB
If you open you should see:

```javascript
{
    "tasks": {
        "work1.website.design": {
            "description": "If you added one",
            "timings": [{
                "start": "2016-02-19T10:00:36.393Z",
                "stop": "2016-02-19T18:01:50.921Z"
            }],
            "log": [
                "start#2016-02-19T10:00:36.393Z",
                "stop#2016-02-19T18:01:50.921Z"
            ]
        },
        "work1.website.deployServer": {
            "timings": [{
                "start": "2016-02-19T10:01:59.116Z",
                "stop": "2016-02-19T10:32:10.687Z"
            }],
            "log": [
                "start#2016-02-19T10:01:59.116Z",
                "stop#2016-02-19T10:32:10.687Z"
            ]
        },
        "work2.api.develop.userController": {
            "timings": [{
                "start": "2016-02-19T10:04:23.060Z",
                "stop": "2016-02-19T20:04:36.836Z"
            }],
            "log": [
                "start#2016-02-19T10:04:23.060Z",
                "stop#2016-02-19T20:04:36.836Z"
            ]
        },
        "work2.api.develop.loginController": {
            "timings": [{
                "start": "2016-02-19T10:09:41.848Z",
                "stop": "2016-02-19T13:11:54.059Z"
            }],
            "log": [
                "start#2016-02-19T10:09:41.848Z",
                "stop#2016-02-19T13:11:54.059Z"
            ]
        }
    },
    "config": {
        "format.output": "DD/MM",
        "config.version": 2
    }
}
```

## Method

### Start (start|s)

Start a new task.

```
$ timer start <key of the task> <description>
```

### Pause (pause|p)

Pause a task

```
$ timer pause <key of the task>
$ timer p <key of the task>
```

### Unpause (unpause|up)

Unpause a task

```
$ timer unpause <key of the task>
$ timer up <key of the task>
```

### Finish (finish|f)

Stop a task, also can add a description

```
$ timer finish <key of the task> <description>
```

### Description (description|d)

Add a description to the task

```
$ timer description <key of the task> <description>
$ timer d <key of the task> <description>
```

### Add (add)

Add time to the task selected

```
$ timer add <key of the task> <stringTime>
$ timer add <key of the task> 1h2m3s
```

### Subtract (subtract|sub)

Subtract time to the task selected

```
$ timer subtract <key of the task> <stringTime>
$ timer sub <key of the task> <stringTime>
$ timer subtract <key of the task> 1h2m3s
$ timer sub <key of the task> 1h2m3s
```

### Report (report|r)

This method outputs via cli a table. Some examples:

```
$ timer report
$ timer r -f md
$ timer r -f markdown
$ timer r -f markdown > report.md
$ timer r -f md > report.md
$ timer r > report.json
$ timer export <key of the task>
$ timer r <key of the task> -f md
$ timer r <key of the task> -f markdown
$ timer r <key of the task> -f markdown > report.md
$ timer r <key of the task> -f md > report.md
$ timer r <key of the task> > report.json
```

### Log (log|l)

Log a task if you want to have the real timer on one console.

```
$ timer log <key of the task>
```

### Export (export|e)

This method output a json or markdown with all the tasks or all the selected tasks.

Options:

* -f --format: define the format (default is json). Ex. json|markdown|md
* -s --start: filter by start date. Ex. 2017/05/28
* -e --end: filter by start date. Ex. 2017/05/28
* -x --expanded: If you have mutiple days in a task, expands shows this as a independant entry on the table. Default is false

In 2.5.0 its included an export option that has json and markdown as valid outputs, this are some examples:

```
$ timer export
$ timer e -f md
$ timer e -f markdown
$ timer e -f markdown > report.md
$ timer e -f md > report.md
$ timer e > report.json
$ timer export <key of the task>
$ timer e <key of the task> -f md
$ timer e <key of the task> -f markdown
$ timer e <key of the task> -f markdown > report.md
$ timer e <key of the task> -f md > report.md
$ timer e <key of the task> > report.json
$ timer e <key of the task> -f md -x -e 2017/08/26
$ timer e <key of the task> -f md -x -s 2017/08/26
$ timer e <key of the task> -f md -e 2017/08/26
$ timer e <key of the task> -f md -s 2017/08/26
```

Thanks [@MarAvFe][maravfe] and [@mlndz28][mlndz28] for its contribution.

### Delete (delete|del)

delete|del [task_string] Remove tasks from the list. Empty for select all tasks

### Configure (configure)

configure <key> <value> Configure the value of the config passing a key

### Configure (configure)

configuration

## Notes

To use the autocomplete run `timer --setupCLI`
If you have the version 1.x and you want to conserve the DB, run `timer --updateDB` to update the DB to version 2.x

## Development

Run `npm install;npm run dev` to watch the proyect, and compile the code automatically.
Run `npm build` to build the module.

## Contributors

* [@MarAvFe][maravfe]
* [@mlndz28][mlndz28]

## License

Licensed under the MIT license. 2015

[paypal-badge]: https://img.shields.io/badge/❤%20support-paypal-blue.svg?style=flat-square
[paypal-link]: https://www.paypal.me/danibram
[npm-home-module]: https://www.npmjs.com/package/time-tracker-cli
[maravfe]: https://github.com/MarAvFe
[mlndz28]: https://github.com/mlndz28
