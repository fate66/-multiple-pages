<template>
    <section name="fade">
        <img src=""/>
    </section>
</template>

<script>

  // import wxMask from './wxMask'

  export default {
    name: 'wxMask',
    data() {
      return {
        show: true
      }
    },
    components: {},
    created() {
    },
    methods: {
      ck() {
        this.show = false
        this.$emit('select-mask')
      }
    },
    mounted() {
    }
  }
</script>

<style lang='scss' scoped>
    .wx-mask {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999;
        img{
           width: 750px;
        }
    }

</style>
