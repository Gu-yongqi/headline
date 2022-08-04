<template>
  <div class="regin">
    <van-nav-bar title="注册" left-arrow @click-left="$router.back()" placeholder fixed z-index="999" />
    <div class="ipt" style="margin-top:20px;">
      <van-icon name="orders-o" />
      <input type="text" placeholder="请输入账号" autocomplete="off" v-model="username">
      <div @click="clearName" :style="{display:(username.length>0?'block':'none')}">X</div>
    </div>
    <div class="ipt" style="margin-top:20px;">
      <van-icon name="shield-o" />
      <input type="password" placeholder="请输入密码" autocomplete="off" v-model="password">
      <div @click="clearWord" :style="{display:(password.length>0?'block':'none')}">X</div>
    </div>
    <div class="ipt" style="margin-top:20px;display:flex;">
      <van-icon name="records" style="margin-top:5px;" />
      <input type="vercode" placeholder="请输入验证码" autocomplete="off" v-model="vercode">
      <button style="width:120px;border-radius:24px;border:0;position: absolute;right:0;background-color:#07c160;color:#fff;" @click="btn">{{name}}</button>
    </div>
    <button class="btn" @click="submit">注册</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      vercode: '',
      name: '获取验证码',
      num: 60,
      flag: true
    }
  },
  methods: {
    btn() {
      if (this.flag) {
        let time;
        if (this.num !== 0) {
          time = setInterval(v => {
            this.num -= 1
            this.name = this.num
            this.flag = false
            if (this.num === 0) {
              clearInterval(time);
              this.name = '获取验证码'
              this.num = 60
              this.flag = true
            }
          }, 1000)
        }
      }
      let { username } = this
      this.axios({
        url: '/user/sendSms',
        method: 'POST',
        data: {
          mobile: username,
          type: 'register'
        }
      }).then(res => {
        console.log(res);
      })
    },
    submit() {
      let { username, password, vercode } = this
      let regname = /^1[3-9][0-9]{9}$/
      let regword = /^[\d]{6,8}$/
      let regcode = /^[0-9]{6}$/
      if (!(regname.test(username))) {
        this.$toast('账号格式不对')
        return
      }
      if (!(regword.test(password))) {
        this.$toast('密码格式不对')
        return
      }
      if (!(regcode.test(vercode))) {
        this.$toast('验证码格式不对')
        return
      }
      this.axios({
        url: '/user/reg',
        method: 'POST',
        data: {
          username,
          password,
          vercode
        }
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$toast('注册成功');
          let { token, tokenExpired, uid, userInfo } = res.data
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('tokenExpired', tokenExpired)
          sessionStorage.setItem('uid', uid)
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
          this.$root.token = token
          this.$root.uid = uid
          this.$root.userInfo = userInfo
          setTimeout(v => {
            this.$router.back()
          }, 1500)
        } else {
          this.$toast(res.data.msg);
        }
      })
    },
    clearName() {
      this.username = ''
    },
    clearWord() {
      this.password = ''
    },
  }
}
</script>

<style lang="scss">
.regin {
  .ipt {
    width: 350px;
    height: 42px;
    // border: 1px solid #aaa;
    border-radius: 20px;
    line-height: 42px;
    margin: 0 auto;
    font-size: 13px;
    position: relative;
    input {
      width: 220px;
      letter-spacing: 1px;
      border: #fff;
      margin-left: 30px;
      height: 30px;
    }
    div {
      position: absolute;
      top: 15px;
      right: 20px;
      background-color: #aaa;
      opacity: 0.5;
      color: #fff;
      width: 12px;
      line-height: 12px;
      text-align: center;
      font-size: 12px;
      border-radius: 50%;
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