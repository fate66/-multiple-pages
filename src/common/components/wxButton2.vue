<template>
    <div class="btn" :style="btnSY" @click="ck">
        <slot></slot>
    </div>
</template>

<script>

  export default {
    props: {
      background: {
        type: String,
        default: '#52B992'
      },
      width: {
        type: Number,
        default: 670
      },
      marginTop: {
        type: Number,
        default: 0
      },
      borderRadius: {
        type: Number,
        default: 12
      },
      opacity: {
        type: Number,
        default: 1
      }
    },
    computed: {
      btnCls() {
        return ['btn', this.type, this.size]
      },
      btnSY() {
        return {
          marginTop: this.heightpx2rem(this.marginTop),
          background: this.background,
          width: this.$utils.widthpx2rem(this.width) + 'rem',
          borderRadius: this.$utils.widthpx2rem(this.borderRadius) + 'rem',
          opacity: this.opacity
        }
      }
    },
    data() {
      return {}
    },
    created() {
    },
    methods: {
      heightpx2rem(val) {
        return this.$utils.heightpx2rem(val) + 'rem'
      },
      ck() {
        this.$emit('click')
      }
    }
  }
</script>

<style lang='scss' scoped>
    .btn {
        margin: 0 auto;
        font-family: PingFang-SC-Regular;
        font-size: 34px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        height: 88px;
        line-height: 88px;
    }
</style>
