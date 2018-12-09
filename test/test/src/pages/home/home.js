import qs from 'qs'
import Voila from '../../voila'
import genDefaultData from '../../defaultData'

Voila({
    data: {
        list: [
            1
        ]
    },

    onLoad() {
        qs.stringify({
            name: 'anka'
        })
        this.setData({
            ...genDefaultData()
        })
    },

    onShow() {
        console.log(this, 'hello')
    },

    onTap () {
        this.$setData({
            value: this.data.value + 1
        })
    },

    computed: {
        computedValue () {
            return this.data.value + 1
        }
    }
})
