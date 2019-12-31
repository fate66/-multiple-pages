<template>
    <wx-cell-box v-on="$listeners" v-bind="$attrs">
        <div class="title">
            <slot name="title">
                <p class="cell-title">{{title}}</p>
            </slot>
            <slot name="icon"></slot>
        </div>
        <slot name="value">
            <div class="cell-value">
                {{value}}<img v-if="link" src="../../static/img/jt-right.png"/>
            </div>
        </slot>
    </wx-cell-box>
</template>

<script>
  /**
   * title: 标题
   * value： 值
   * solt-title：替换title
   * solt-icon: title后面追加
   */
  import wxCellBox from './wxCellBox'

  export default {
    props: {
      title: {},
      value: {},
      link: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      // rwh() {
      //   let w = this.$utils.widthpx2rem(this.width)
      //   return w.toFixed(5) + 'rem'
      // }
    },
    data() {
      return {}
    },
    created() {
    },
    components: {wxCellBox},
    methods: {}
  }
</script>

<style lang='scss' scoped>
    .title {
        /*flex: 1;*/
        display: flex;
        align-items: center;
        .cell-title {
            font-family: PingFang-SC-Regular;
            font-size: 32px;
            color: #353535;
            letter-spacing: 0;
            white-space: nowrap;
            overflow: hidden;
        }
    }

    .cell-value {
        display: flex;
        align-items: center;
        height: 87px;
        ont-family: PingFang-SC-Regular;
        font-size: 32px;
        color: #888888;
        letter-spacing: 0;
        text-align: right;
        img {
            width: 44px;
            height: 44px;
            margin-left: 28px;
        }
    }
</style>
