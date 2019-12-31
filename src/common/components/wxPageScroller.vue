<template>
    <wx-scroller ref="scroller"
                 :onPullDownRefresh="onPullDownRefresh"
                 :onReachBottom="onReachBottom"
                 :stopReachBottom.sync="stopReachBottom"
                 :reachBottomSuc="reachBottomSuc"
                 v-bind="$attrs">
        <slot></slot>
    </wx-scroller>
</template>

<script>

  import wxScroller from './wxScroller'

  export default {
    props: {
      page: {
        type: Number,
        default: 0
      },
      pageSize: {
        type: Number,
        default: 10
      },
      data: {
        type: Object,
        default: () => {
        }
      }
    },
    computed: {},
    data() {
      return {
        page_no: 0,
        stopReachBottom: false,
        showLoadMore: true,
        reachBottomSuc: false,
        startBottom: false
      }
    },
    created() {
      this.getData()
    },
    components: {wxScroller},
    methods: {
      onPullDownRefresh() {
        this.$refs.scroller.reset_scroll()
        this.page_no = 0
        this.stopReachBottom = false
        this.getData()
      },
      onReachBottom() {
        this.page_no++
        this.startBottom = true
        this.getData()
      },
      get_res(res) {
        let data
        for (let k of this.data.key) {
          data = res[k]
        }
        return data
      },
      getData() {
        if (!this.data.url) {
          console.log('URL或KEY不能为空')
          return false
        }
        let param = Object.assign({page_no: this.page_no, page_size: this.pageSize}, this.data.params)
        console.log(param, '请求的参数')
        this.$http.get(this.data.url, param, res => {
          if (res._ok) {
            // let list = []
            // if (!Array.isArray(res[this.data.key])) {
            //   console.log(res, this.data.key, list)
            //   list = res[this.data.key]
            // } else {
            //   list = res[this.data.key][this.data.key2]
            // }
            const list = this.get_res(res)
            let length = list.length
            this.$emit('getListData', list, this.page_no, res)
            // if (this.page_no === 0 && length === 0) {
            //   this.empty = true
            // } else {
            //   this.empty = false
            // }
            // if (this.onPullDownRefresh) {
            //   wx.stopPullDownRefresh()
            //   this.onPullDownRefresh = false
            // }
            if (length < this.pageSize) {
              this.stopReachBottom = true
            }
            // 关闭上拉
            if (this.startBottom) {
              this.reachBottomSuc = !this.reachBottomSuc
              this.startBottom = false
            }
          }
        })
      }
    },
    mounted() {
    },
    beforeDestroy() {
    }
  }
</script>

<style lang='scss' scoped>
</style>
