<template>
    <div>
        <wx-cell @select-cell="ck" v-bind="$attrs">
            <div v-if="valueSlot">
                <slot></slot>
            </div>
        </wx-cell>
        <div v-if="show">
            <slot name="pan"></slot>
        </div>
    </div>
</template>

<script>
  import wxCell from './wxCell'

  export default {
    props: {},
    data() {
      return {
        show: false,
        valueSlot: false
      }
    },
    created() {
      this.valueSlot = this.checkSlot('value')
    },
    components: {wxCell},
    methods: {
      checkSlot(key) {
        return !!this.$slots[key]
      },
      ck() {
        this.show = !this.show
      }
    }
  }
</script>

<style lang='scss' scoped>

</style>
