<template>
  <div class="info">
    <van-nav-bar title="个人详情" left-arrow @click-left="$router.back()" placeholder fixed z-index="999" />
    <div class="tx">
      <div>头像</div>
      <div>
        <input type="file" @change="ipt">
        <img :src="$root.userInfo.avatar||'/img/logo.png'" alt="">
      </div>
      <div>
        <van-icon name="arrow" color="#aaa" />
      </div>
    </div>
    <van-cell title="昵称" is-link :value="userInfo.nickname||nc" @click="showPopup" />
    <van-popup v-model="show1" :style="{ height: '20%' }">
      <input type="text" v-model="text" style="width:88vw;height:38px;border-radius:24px;border:1px solid #07c160;margin-top:15px;" placeholder="请输入要修改的昵称">
      <div @click="revise" style="width:90vw;height:38px;line-height:38px;margin-top:20px;text-align:center;background-color:#07c160;color:#fff;">确定</div>
    </van-popup>
    <van-cell title="性别" is-link :value="userInfo.sex||xb" @click="show2=true" />
    <van-action-sheet v-model="show2" :actions="actions" @select="select" cancel-text="取消" />
    <van-cell title="生日" is-link :value="userInfo.birthday||currentDate.getFullYear()+'-'+(currentDate.getMonth() + 1)+'-'+currentDate.getDate()" @click="model=true" />
    <van-popup v-model="model" position="bottom" :style="{ height: '30%' }">
      <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate" @cancel="cancel" @confirm="confirm" />
    </van-popup>
    <div class="btn" @click="btn">确定</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nc: '五阿哥不上朝',
      show1: false,
      xb: '男',
      text: '',
      sr: '',
      show2: false,
      model: false,
      actions: [{ name: '男' }, { name: '女' }],
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2050, 0, 1),
      currentDate: new Date(2022, 6, 12),
      userInfo: {}
    }
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
  },
  methods: {
    btn() {
      let { avatar, nickname, sex, birthday } = this.userInfo
      this.axios({
        url: '/user/editUserInfo',
        method: 'POST',
        data: {
          avatar,
          nickname,
          sex,
          birthday,
          uid: this.$root.uid
        }
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$toast('修改成功')
          let { userInfo } = this
          this.$root.userInfo = userInfo
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
          setTimeout(v => {
            this.$router.back()
          }, 800)
        } else {
          this.$toast('修改失败')
        }
      })
    },
    async ipt(e) {
      let file = e.target.files[0]
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
        this.userInfo.avatar = avatar
        this.$forceUpdate()
      })
    },
    info() {
      return this.axios({
        url: 'https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http/upload/token',
        method: 'POST'
      })
    },
    showPopup() {
      this.show1 = true;
    },
    select(item) {
      this.show2 = false
      this.userInfo.sex = item.name
    },
    revise() {
      this.show1 = false
      this.userInfo.nickname = this.text
      this.text = ''
    },
    cancel() {
      this.model = false
    },
    confirm(e) {
      this.userInfo.birthday = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate()
      this.model = false
    }
  },
}
</script>

<style lang="scss">
.info {
  .tx {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80px;
    border-bottom: 1px solid #f6f6f6;
    padding: 0 18px;
    div:nth-of-type(1) {
      font-size: 13px;
    }
    div:nth-of-type(2) {
      margin-left: 230px;
      position: relative;
      input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        cursor: pointer;
        opacity: 0;
      }
      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
      }
    }
  }
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