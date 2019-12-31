export default {
  created() {
    console.log('start data reporting')
    if (this.$utils.cookie.get('openid')) {
      this.$http.post(this.$comApi.add_wx_statistics, {
        item_action: 3000,
        item_page_obj: this.$utils.urlQuery('id'),
        item_page: this.$utils.pageName(),
        item_from: this.$utils.urlQuery('wfr'),
        item_action_obj: '',
        item_from_obj: ''
      })
    } else {
      this.$http.get(this.$comApi.statisV2Add, {
        item_action: 3000,
        item_page_obj: this.$utils.urlQuery('id'),
        item_page: this.$utils.pageName(),
        item_from: this.$utils.urlQuery('wfr')
      })
    }
  }
}
