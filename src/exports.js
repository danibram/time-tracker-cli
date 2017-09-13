import Manager from './core/Manager'
import Configstore from 'configstore'

import pkg from '../package.json'

const config = new Configstore(pkg.name, {
    tasks:{},
    config:{
        'format.output': 'DD/MM'
    }
})

export default () => {
    return new Manager(config)
}
