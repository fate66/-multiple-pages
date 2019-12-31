<template>
    <section ref="smain" class="wx-main"
             @scroll.passive="onScroll" :style="scrollSty">
        <div ref="scontent" class="wx-scroll">
            <div class="wx-refresh" v-if="onPullDownRefresh">{{refreshText}}</div>
            <slot></slot>
            <div class="wx-loadMore" v-if="showLoadMoreText" :style="loadMoreSty">{{loadMoreText}}</div>
        </div>
    </section>
</template>

<script>
  /**
   * onPullDownRefresh: 下拉回调
   * onReachBottom： 上拉回调
   * stopReachBottom：到达最后一页
   * reachBottomSuc: 触达底部完成
   * width: 页面宽度（默认全屏）
   * height：页面高度 默认全屏）
   * pullOffset：下拉刷新偏移的距离
   * bottomOffset：上拉刷新偏移的距离
   */

  export default {
    props: {
      onPullDownRefresh: {
        type: Function
      },
      onReachBottom: {
        type: Function
      },
      stopReachBottom: {
        type: Boolean,
        default: false
      },
      reachBottomSuc: {
        type: Boolean,
        default: false
      },
      width: {
        type: Number,
        default: 0
      },
      height: {
        type: Number,
        default: 0
      },
      pullOffset: {
        type: Number,
        default: 100
      },
      bottomOffset: {
        type: Number,
        default: 100
      },
      marginBottom: {
        type: Number,
        default: 0
      }
    },
    computed: {
      scrollSty() {
        return {
          height: this.height ? this.$utils.heightpx2rem(this.height) + 'rem' : this.$utils.dp2rem(this.$utils.getWindowHeight()),
          width: this.width ? this.widthpx2rem(this.width) : this.$utils.dp2rem(this.$utils.getWindowWidth())
        }
      },
      loadMoreSty() {
        return {
          marginBottom: this.$utils.widthpx2rem(this.marginBottom) + 'rem'
        }
      },
      showLoadMoreText() {
        if (this.scrollHeight === this.offsetHeight) return false
        return this.stopReachBottom || !this.startPull
      }
    },
    data() {
      return {
        top: 0,
        startPageY: 0,
        move: 0,
        refreshText: '下拉刷新...',
        loadMoreText: '加载更多...',
        startPull: true, // 开始上拉回调 用于避免多次上拉回调
        scrollHeight: 0, // 滚动内容的真实高度
        offsetHeight: 0 // 拦截橡皮筋
      }
    },
    created() {
    },
    components: {},
    watch: {
      reachBottomSuc() {
        this.changeStartPull()
      }
    },
    methods: {
      reset_scroll() {
        this.$refs.smain.scrollTop = 0
      },
      changeStartPull() {
        this.$nextTick(() => {
          this.startPull = true
        })
      },
      down(num) {
        return this.startPageY < num
      },
      domSty(prop, key, val) {
        this.$refs[prop].style[key] = val
      },
      dp2rem(dp) {
        return this.$utils.dp2rem(dp) + 'rem'
      },
      widthpx2rem(px) {
        return this.$utils.widthpx2rem(px) + 'rem'
      },
      domRefresh() {
        this.domSty('scontent', 'transform', `translate3d(0,${this.dp2rem(this.move)}, 0)`)
      },
      changeTransform() {
        // console.log(this.move, 'move')
        this.move = this.move - 10 < 0 ? 0 : this.move - 10
        this.domRefresh()
        // document.querySelector('.scroller').style.transform = `translateY(${this.move}px)`
        if (this.move <= 0) {
          this.refreshText = '下拉刷新...'
          return
        }
        window.requestAnimationFrame(() => {
          this.changeTransform()
        })
      },
      touchStart(e) {
        // console.log(e.targetTouches[0].pageY, '开始--')
        this.startPageY = e.targetTouches[0].pageY
      },
      touchMove(e) {
        // console.log(this.top,  )
        if (e.cancelable) {
          if (this.onPullDownRefresh && this.top === 0 && this.down(e.targetTouches[0].pageY)) {
            if ((e.targetTouches[0].pageY - this.startPageY) < this.pullOffset) {
              this.move = e.targetTouches[0].pageY - this.startPageY
              console.log('开始上拉')
              this.domRefresh()
              // document.querySelector('.scroller').style.transform = `translateY(${move}px)`
            } else {
              this.refreshText = '松开即可刷新'
            }
          }
          if ((this.scrollHeight == this.offsetHeight) || (!this.top && this.down(e.targetTouches[0].pageY)) || (this.scrollHeight - this.top - this.offsetHeight === 0 && !this.down(e.targetTouches[0].pageY))) {
            e.preventDefault()
            e.stopPropagation()
          } // 拦截iOS橡皮筋
        }
      },
      touchEnd(e) {
        if (this.top === 0 && this.down(e.changedTouches[0].pageY)) {
          // console.log(e.changedTouches[0].pageY, '结束--')
          this.onPullDownRefresh && e.changedTouches[0].pageY - this.startPageY > this.pullOffset && this.onPullDownRefresh()
          this.startPageY = 0
          this.refreshText = '开始刷新...'
          this.$emit('update:stopReachBottom', false)
          this.changeTransform()
        }
        // return true
      },
      onScroll(e) {
        this.top = e.target.scrollTop
        if (this.onReachBottom) {
          if (!this.stopReachBottom) {
            if (e.target.scrollHeight - this.top - e.target.offsetHeight < this.bottomOffset) {
              console.log('开始上拉加载')
              this.loadMoreText = '加载中...'
              this.startPull && this.onReachBottom()
              this.startPull = false
            }
          } else {
            this.loadMoreText = '暂无更多'
          }
        }
        // console.log(document.querySelector('.more').offsetTop, '滚动')
        // console.log(e.target.scrollTop, e.target.scrollHeight, e.target.offsetHeight, '滚动')
      },
      addEventListener(action, FN, passive) {
        this.$refs.smain.addEventListener(action, FN, {passive: passive})
      },
      removeEventListener(action, FN) {
        this.$refs.smain.removeEventListener(action, FN)
      }
    },
    mounted() {
      if (this.onPullDownRefresh) {
        this.addEventListener('touchstart', this.touchStart, false)
        this.addEventListener('touchmove', this.touchMove, false)
        this.addEventListener('touchend', this.touchEnd, false)
      }
      if (this.height) {
        this.offsetHeight = this.height
      } else {
        const offset = this.$utils.getElementToPageTop(this.$refs.smain)
        if (offset) {
          this.offsetHeight = this.$utils.getWindowHeight() - offset // 拦截橡皮筋
          this.domSty('smain', 'height', this.dp2rem(this.$utils.getWindowHeight() - offset))
        } else {
          this.offsetHeight = this.$utils.getWindowHeight()
        }
      }
    },
    updated() {
      this.scrollHeight = this.$refs.smain.scrollHeight
    },
    beforeDestroy() {
      if (this.onPullDownRefresh) {
        this.removeEventListener('touchstart', this.touchStart)
        this.removeEventListener('touchmove', this.touchMove)
        this.removeEventListener('touchend', this.touchEnd)
      }
    }
  }
</script>

<style lang='scss' scoped>
    .wx-main {
        width: 750px;
        height: 1334px;
        overflow: auto;
        .wx-scroll {
            position: relative;
            .wx-refresh {
                position: absolute;
                left: 0;
                top: -100px;
                font-size: 32px;
                right: 0;
                height: 100px;
                text-align: center;
                line-height: 100px;
            }
            .wx-loadMore {
                width: 100%;
                height: 100px;
                text-align: center;
                line-height: 100px;
                font-size: 32px;
            }
        }
    }

</style>
