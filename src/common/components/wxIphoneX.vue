<template>
    <section v-if="isIpx && isIphoneX">
        <slot name="iphoneX">
            <div class="iphone_X" :style="{'background-color': bgColor}"></div>
        </slot>
    </section>
</template>

<script>

  import ua from '../utils/ua'

  export default {
    props: {
      bgColor: {
        type: String,
        default: 'white'
      },
      isIphoneX: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    },
    computed: {
      isIpx() {
        return ua.isIPhoneX_later()
      }
    },
    created() {
    },
    components: {},
    methods: {}
  }
</script>

<style lang='scss' scoped>
    .iphone_X {
        width: 750px;
        height: 68px;
    }
</style>
