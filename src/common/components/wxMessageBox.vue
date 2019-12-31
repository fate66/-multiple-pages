<template>
    <div class="mask">
        <div class="box">
            <div class="title">{{title}}</div>
            <div class="text">{{text}}</div>
            <input v-model="inputValue" @blur="blur"/>
            <div class="line"></div>
            <div :class="['sure', inputValue&&'can-sure']" @click="confirmHandler">{{confirmText}}</div>
        </div>
    </div>
</template>

<script>
  import ua from 'src/common/utils/ua'

  export default {
    props: {
      transition: {
        type: String,
        default: 'fade'
      },
      title: {
        type: [String, Number],
        default: ''
      },
      text: {
        type: [String, Number],
        default: ''
      },
      type: {
        type: [String],
        default: 'alert'
      },
      isShowInput: {
        type: Boolean,
        default: false
      },
      isShowCancelButton: {
        type: Boolean,
        default: false
      },
      isColumnButton: {
        type: Boolean,
        default: false
      },
      inputType: {
        type: [String],
        default: 'text'
      },
      confirmText: {
        type: [String, Number],
        default: '确定'
      },
      cancelText: {
        type: [String, Number],
        default: '取消'
      },
      onShow: {
        type: Function,
        default: () => {
        }
      },
      onHide: {
        type: Function,
        default: () => {
        }
      },
      onConfirm: {
        type: Function,
        default: () => {
        }
      },
      onCancel: {
        type: Function,
        default: () => {
        }
      },
      onMaskClick: {
        type: Function,
        default: () => {
        }
      },
      validate: {
        type: Function,
        default: () => {
          return true
        }
      }
    },
    data() {
      return {
        inputValue: ''
      }
    },
    computed: {
      messageBoxTransition() {
        if (this.transition) {
          return `messagebox-${this.transition}`
        } else {
          return ''
        }
      },
      isConfirmDisabled() {
        if (this.type === 'prompt') {
          return !this.validate(this.inputValue)
        } else {
          return false
        }
      }
    },
    created() {
    },
    watch: {
      inputType(val) {
        this.handleInputType(val)
      }
    },
    methods: {
      maskClick() {
        this.onMaskClick()
      },
      handleInputType(val) {
        if (val === 'range' || !this.$refs.input) {
          return false
        }
        // this.$refs.input.type = val
      },
      blur() {
        if (ua.isIOS && ua.isWX) {
          window.scrollTo(0, 0)
        }
      },
      confirmHandler() {
        if (this.inputValue) {
          this.$emit('Confirm', this.inputValue)
        }
      }
    }
  }

</script>

<style lang="scss" scoped>
    .mask {
        width: 100vw;
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, .5);
        display: flex;
        align-items: center;
        justify-content: center;
        .box {
            border-radius: 16px;
            background: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            /*min-height: 200px;*/
            box-sizing: border-box;
            width: 600px;
            .title {
                margin-bottom: 16px;
                text-align: center;
                align-self: stretch;
                line-height: 50px;
                padding-top: 56px;
                padding-left: 56px;
                padding-right: 56px;
                font-family: PingFang-SC-Regular;
                font-size: 40px;
                color: #000000;
            }
            .text {
                font-family: PingFangSC-Regular;
                font-size: 26px;
                color: #888888;
                text-align: center;
                line-height: 40px;
                margin-top: 10px;
            }
            input {
                margin-top: 40px;
                padding: 16px;
                width: 488px;
                height: 64px;
                font-size: 38px;
                line-height: 64px;
                border: 1px solid #DDDDDD;
                box-sizing: border-box;
                border-radius: 8px;
            }
            .line {
                margin-top: 40px;
                border-top: 1px solid #DDDDDD;
                height: 0;
                width: 100%;
            }
            .sure {
                height: 98px;
                text-align: center;
                line-height: 98px;
                opacity: .3;
                font-family: PingFang-SC-Regular;
                font-size: 36px;
                color: #07A836;
                text-align: center;
            }
            .can-sure {
                opacity: 1;
            }
        }
    }
</style>
