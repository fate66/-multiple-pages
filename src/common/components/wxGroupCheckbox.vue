<template>
    <div>
        <wx-cell v-for="(item, i) in cacheList" :key="i" @select-cell="selectCell(i)" :title="item.title"
                 :borderBottom="!(i==cacheList.length - 1&&!lastBorderBottom)">
            <wx-checkbox :value="item[keyName]" slot="value"></wx-checkbox>
        </wx-cell>
    </div>
</template>

<script>
  /**
   *   list: 多选框接收的对象 title代表 cell的title
   *   keyName：唯一标示
   *   lastBorderBottom： 是否需要最后一个线 默认需要
   *   v-model：直接获取到选中的值
   *   select-checkbox：监听事件，获取每次选中的值
   */
  import wxCell from './wxCell'
  import wxCheckbox from './wxCheckbox'

  export default {
    props: {
      list: {
        type: Array,
        default: () => []
      },
      keyName: {
        type: String,
        default: 'value'
      },
      lastBorderBottom: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        cacheList: []
      }
    },
    created() {
      this.cache = {}
      this.cacheList = this.list
    },
    watch: {
      list: {
        handler: val => {
          this.cache = {}
          this.cacheList = val
        },
        deep: true
      }
    },
    components: {wxCell, wxCheckbox},
    methods: {
      selectCell(index) {
        let row = this.cacheList[index]
        row[this.keyName] = !row[this.keyName]
        if (row[this.keyName]) {
          this.cache[index] = row
        } else {
          Reflect.deleteProperty(this.cache, index)
        }
        let list = []
        for (let key in this.cache) {
          list.push(this.cache[key])
        }
        this.$emit('input', list)
        this.$emit('select-checkbox', {index, row})
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
