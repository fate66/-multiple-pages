<template>
    <img :src="src" class="code"/>
</template>

<script>
  import {c_2} from 'src/api'

  export default {
    props: {
      id: {},
      self: {
        type: Object,
        require: true
      }
    },
    data() {
      return {
        src: ''
      }
    },
    created() {
      this.huomaDetail()
    },
    components: {},
    watch: {
      id(val) {
        this.huomaDetail()
      }
    },
    methods: {
      huomaDetail() {
        this.$parent.$http.get(c_2.getQrcode, {
          activity_id: this.id || this.$parent.$utils.urlQuery('id'),
          nd_expire: this.nd_expire || this.$utils.urlQuery('nd_expire')
        }, res => {
          this.src = res.qr_code
          this.$emit('huoma', res)
        })
      }
    },
    mounted() {
    },
    updated() {
    }
  }
</script>

<style lang='scss' scoped>
    .code {
        width: 100% !important;
        height: auto !important;
        display: block;
    }
</style>
