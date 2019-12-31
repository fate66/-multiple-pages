<template>
    <div class="wx-grid">
        <div class="wx-grid-item" :style="{width: width, marginRight: marginRight(i)}" v-for="(item, i) in list" :key="i" @click="ck(i, item)">
            <img :src="item.src"/>
            <span>{{item.text}}</span>
        </div>
    </div>
</template>

<script>
  /**
   * title: 标题
   * value： 值
   * solt-title：替换title
   * solt-icon: title后面追加
   */
  export default {
    props: {
      list: {
        type: Array,
        default: () => []
      },
      width: {
        type: Number,
        default: 112
      },
      column: {
        type: Number,
        default: 4
      }
    },
    computed: {
      mr() {
        return this.$utils.widthpx2rem((670 - this.width * this.column) / 3) + 'rem'
      }
    },
    data() {
      return {}
    },
    created() {
    },
    components: {},
    methods: {
      marginRight(i) {
        return i % 4 == 3 ? 0 : this.mr
      },
      ck(index, data) {
        this.$emit('sel-grid', {index, data})
      }
    }
  }
</script>

<style lang='scss' scoped>
    .wx-grid {
        width: 750px;
        padding: 20px 40px;
        box-sizing: border-box;
        display: flex;
        flex-wrap: wrap;
        .wx-grid-item {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
            width: 112px;
            img {
                width: 100%;
                height: auto;
            }
            span {
                margin-top: 6px;
                font-family: PingFang-SC-Regular;
                font-size: 24px;
                color: #353535;
                letter-spacing: 0;
                text-align: center;
            }
        }
    }
</style>
