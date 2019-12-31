<template>
    <section class="fixed" @touchmove="touchMove">
        <slot></slot>
        <wx-iphone-x v-if="isIpx" v-bind="$attrs">
            <div slot="iphoneX" v-if="iphoneXSlot">
                <slot name="iphoneX"></slot>
            </div>
        </wx-iphone-x>
    </section>
</template>

<script>

  // import ua from '../utils/ua'
  import wxIphoneX from './wxIphoneX'

  export default {
    data() {
      return {
        iphoneXSlot: false
      }
    },
    computed: {
      isIpx() {
        // return ua.isIPhoneX_later()
        return false
      }
    },
    created() {
      this.iphoneXSlot = this.checkSlot('iphoneX')
    },
    components: {wxIphoneX},
    methods: {
      checkSlot(key) {
        return !!this.$slots[key]
      },
      touchMove(e) {
        e.preventDefault()
      }
    }
  }
</script>

<style lang='scss' scoped>
    .fixed {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 750px;
    }
</style>
