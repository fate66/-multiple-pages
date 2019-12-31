<template>
    <div :class="['wx-cell-box', borderBottom&&'no-border-bottom']" @click="ck">
        <slot></slot>
    </div>
</template>

<script>
  /**
   * borderBottom 是否需要边框下面的线
   *  select-cell 选中cell的监听事件
   */
  export default {
    props: {
      borderBottom: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    },
    created() {
    },
    components: {},
    methods: {
      ck() {
        this.$emit('select-cell')
      }
    }
  }
</script>

<style lang='scss' scoped>
    .wx-cell-box {
        border-bottom: #ffff 1px solid;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 87px;
        margin-left: 40px;
        margin-right: 40px;
        width: 670px;
        box-sizing: content-box;
    }

    .no-border-bottom{
        border-bottom: #DDDDDD 1px solid;
    }
</style>
