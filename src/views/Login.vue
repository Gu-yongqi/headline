<template>
  <div class="login">
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" placeholder fixed z-index="999" />
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
    <button class="btn" @click="submit">登录</button>
    <div class="log">
      <div @click="$router.push('/forget')">忘记密码</div>
      <div @click="$router.push('/regin')">还无账号</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    submit() {
      let { username, password } = this
      let regname = /^1[3-9][0-9]{9}$/
      let regword = /^[\d]{6,8}$/
      if (!(regname.test(username))) {
        this.$toast('账号格式不对')
        return
      }
      if (!(regword.test(password))) {
        this.$toast('密码格式不对')
        return
      }
      this.axios({
        url: '/user/login',
        method: 'POST',
        data: {
          username,
          password
        }
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$toast('登录成功');
          let { token, tokenExpired, uid, userInfo } = res.data
          sessionStorage.setItem('token', token)
          sessionStorage.setItem('tokenExpired', tokenExpired)
          sessionStorage.setItem('uid', uid)
          sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
          sessionStorage.setItem('search', JSON.stringify([]))
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
.login {
  .ipt {
    width: 350px;
    height: 42px;
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
  .log {
    display: flex;
    justify-content: space-between;
    color: #aaa;
    font-size: 13px;
    margin-top: 20px;
    div:nth-of-type(1) {
      margin-left: 10px;
    }
    div:nth-of-type(2) {
      margin-right: 10px;
    }
  }
}
</style>