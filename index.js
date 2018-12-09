const diff = require('js-deep-diff')

function calculate (conf) {
    const computedValues = {}
    const computed = conf.computed || {}

    Object.keys(computed).forEach(key => {
        // if (conf.data[key]) {
        //     console.error(`data[${key}] already exist!`)
        //     return
        // }
        computedValues[key] = computed[key].call(conf, conf)
    })

    return computedValues
}

module.exports = function Voila (conf) {
    /**
     * conf
     * {
     *      computed: {
     *          computedValue () {
     *              return this.data.value + 1
     *          }
     *      }
     * }
     */


    return Page ({
        ...conf,
        ...calculate(conf),
        $setData (data) {
            const newData = {}
            const differences = diff(this.data, {
                ...data,
                ...calculate(this.data)
            })

            differences.forEach(state => {
                if (state.type === 'EDIT' || state.type === 'ADD') {
                    newData[state.path.reduce((prev, next) => {
                        return prev + `[${next}]`
                    }, '')] = state.rhs
                }
            })

            this.setData(newData)
        }
    })
}
