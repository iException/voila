const diff = require('js-deep-diff')

function calculate (conf) {
    const computedValues = {}
    const computed = conf.computed || {}

    if (!conf.data) {
        conf.data = {}
    }

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
    const computed = calculate(conf)

    return Page ({
        ...conf,
        data: {
            ...conf.data,
            ...computed
        },
        $setData (data = {}) {
            let differences = diff(this.data, data)
            console.log(this.data, data, differences)
            const newData = {}
            this.data = {
                ...this.data,
                ...data
            }
            differences = differences.concat(diff(this.data, {
                ...calculate(this)
            }))

            differences.forEach(state => {
                if (state.type === 'EDIT' || state.type === 'ADD') {
                    newData[state.path.reduce((prev, next, index) => {
                        return prev + index > 0 ? `[${next}]` : next
                    }, '')] = state.rhs
                }
            })

            console.log(newData, differences)

            this.setData({
                ...newData,
            })
        }
    })
}
