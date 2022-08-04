<template>
  <div class="main">
    <van-nav-bar title="发布" placeholder fixed z-index="999" />
    <van-cell-group style="margin-top:10px;">
      <van-field v-model="value" placeholder="请输入标题" />
    </van-cell-group>
    <van-field v-model="message" rows="3" autosize type="textarea" placeholder="请输入留言" show-word-limit style="margin-top:10px;" />
    <van-dropdown-menu active-color="#07c160">
      <van-dropdown-item v-model="value1" :options="option1" />
    </van-dropdown-menu>
    <van-uploader :after-read="afterRead" v-model="img" :max-count="3" />
    <div class="btn" @click="btn">发布</div>
    <van-tabbar v-model="activeFoot" active-color="#07c160" inactive-color="#000" safe-area-inset-bottom placeholder z-index="999" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="add-o" to="/main">发布</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/wode">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import Vue from 'vue';
import { DropdownMenu, DropdownItem } from 'vant';

Vue.use(DropdownMenu);
Vue.use(DropdownItem);
export default {
  data() {
    return {
      activeFoot: 1,
      value: '',
      message: '',
      imageSrc: [],
      img: [],
      value1: 0,
      option1: [
        { text: '今日头条', id: '610128169b33ed00018ed5df', value: 0 },
        { text: '招聘求职', id: '609e99d6935e5b0001eaf4f2', value: 1 },
        { text: '二手市场', id: '609e99e0f2e56f000175151f', value: 2 },
        { text: '婚恋交友', id: '60e83b83a30ce80001c087a0', value: 3 },
        { text: '装修装饰', id: '60e83b96827eca0001ba827c', value: 4 },
        { text: '明日头条', id: '60e83bd9f6a3980001a11be5', value: 5 },
        { text: '劳力市场', id: '61863e3519452d00017f1a8c', value: 6 },
      ],
    }
  },
  methods: {
    btn() {
      this.axios({
        url: '/api/add_article',
        method: 'POST',
        data: {
          title: this.value,
          content: this.message,
          cate_name: this.option1[this.value1].text,
          cate_id: this.option1[this.value1].id,
          author: this.$root.userInfo.author,
          author_id: this.$root.userInfo._id,
          imageSrc: this.imageSrc
        }
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$toast('发布成功')
          this.img = []
          this.value = ''
          this.message = ''
        }
      })
    },
    info() {
      return this.axios({
        url: 'https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http/upload/token',
        method: 'POST'
      })
    },
    async afterRead(e) {
      let file = e.file
      let { data: { token } } = await this.info()
      console.log(file, token);
      let name = file.name.slice(file.name.lastIndexOf('.'))
      let key = `${new Date().getTime()}${Math.random().toString(36).slice(2)}${name}`

      let formDate = new FormData()
      formDate.append('file', file)
      formDate.append('token', token)
      formDate.append('key', key)
      this.axios({
        url: 'https://upload-z1.qiniup.com',
        method: 'POST',
        data: formDate
      }).then(res => {
        console.log(res);
        let avatar = `http://toutiao.longxiaokj.com/${res.data.key}`
        this.imageSrc.push(avatar)
        this.img.push(avatar)
        this.$forceUpdate()
      })
    }
  }
}
</script>

<style lang="scss">
.main {
  height: 100vh;
  background-color: #f6f6f6;
  .btn {
    width: 90vw;
    height: 38px;
    margin: 30px auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #07c160;
    border: 0;
    color: #fff;
  }
}
</style>