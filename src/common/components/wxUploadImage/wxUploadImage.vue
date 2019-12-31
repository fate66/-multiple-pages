<template>
    <section class="upload-img">
        <div class="img-item" v-for="(item, i) in cache" :key="i">
            <img class="item"
                 :src="item"/>
            <img class="del" @click="del(i)" src="./img/del.png"/>
        </div>
        <div class="img-item">
            <img class="item" @click="add" src="./img/add.png"/>
        </div>
    </section>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import {c_2} from 'src/api'

  export default {
    props: {
      value: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        cache: this.value,
        cache_edia_ids: []
      }
    },
    created() {
    },
    components: {},
    watch: {},
    methods: {
      add() {
        this.chooseImage()
      },
      del(i) {
        this.cache.splice(i, 1)
        this.$emit('input', this.cache)
      },
      chooseImage() {
        const self = this
        this.cache_edia_ids = []
        wx.chooseImage({
          count: 9, // 默认9
          sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
          success: async function (res) {
            var localIds = res.localIds // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
            console.log(localIds, 'localIds---')
            // self.cache = self.cache.concat(localIds)
            // self.$emit('input', self.cache)
            for (let i = 0; i < res.localIds.length; i++) {
              let ids = await self.uploadImage(res.localIds[i])
              if (ids) {
                self.cache_edia_ids.push(ids)
              }
            }
            self.$http.post(c_2.uploadImg, {media_ids: self.cache_edia_ids}, res => {
              self.cache = self.cache.concat(res.imgs)
              self.$emit('input', self.cache)
            })
          }
        })
      },
      uploadImage(localId) {
        return new Promise((resolve, reject) => {
          wx.uploadImage({
            localId: localId, // 需要上传的图片的本地ID，由chooseImage接口获得
            isShowProgressTips: 1, // 默认为1，显示进度提示
            success: function (res) {
              resolve(res.serverId)
            },
            fail: function () {
              let e = 0
              reject(e)
            }
          })
        })
      }
    }
  }
</script>

<style lang='scss' scoped>
    .upload-img {
        width: 750px;
        display: flex;
        flex-wrap: wrap;
        padding-left: 10px;
        box-sizing: border-box;
        .img-item {
            width: 204px;
            height: 204px;
            position: relative;
            margin-top: 30px;
            margin-left: 30px;
            .item {
                width: 204px;
                height: 204px;
                display: block;
            }
            .del {
                width: 48px;
                height: 48px;
                position: absolute;
                right: -20px;
                top: -20px;
            }
        }
    }
</style>
