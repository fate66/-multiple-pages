<template>
    <img v-if="value" src="../../static/img/check-sel.png"/>
    <img v-else src="../../static/img/check-no-sel.png"/>
</template>

<script>
  export default {
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {}
    },
    created() {
    },
    components: {},
    methods: {}
  }
</script>

<style lang='scss' scoped>
    img{
        width: 44px;
        height: 44px;
    }
</style>
