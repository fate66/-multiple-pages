<template>
    <div :class="btnCls" :style="btnSY" @click="ck">
        <slot></slot>
    </div>
</template>

<script>

  export default {
    props: {
      type: {
        type: String,
        default: 'green'
      },
      size: {
        type: String,
        default: 'medium'
      },
      marginTop: {
        type: Number,
        default: 50
      }
    },
    computed: {
      btnCls() {
        return ['btn', this.type, this.size]
      },
      btnSY() {
        return {marginTop: this.heightpx2rem(this.marginTop)}
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
        border-radius: 12px;
        margin: 0 auto;
        ont-family: PingFang-SC-Regular;
        font-size: 34px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        height: 88px;
        line-height: 88px;
    }

    .green {
        background: #52B992;
    }

    .medium {
        width: 670px;
    }
</style>
