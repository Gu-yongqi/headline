<template>
  <div class="revise">
    <van-nav-bar title="修改密码" left-arrow @click-left="$router.back()" placeholder fixed z-index="999" />
    <div class="ipt" style="margin-top:20px;">
      <van-icon name="shield-o" />
      <input type="password" placeholder="请输入旧的密码" autocomplete="off" v-model="password1">
      <div @click="clearWord1" :style="{display:(password1.length>0?'block':'none')}">X</div>
    </div>
    <div class="ipt" style="margin-top:20px;">
      <van-icon name="shield-o" />
      <input type="password" placeholder="请输入新的密码" autocomplete="off" v-model="password2">
      <div @click="clearWord2" :style="{display:(password2.length>0?'block':'none')}">X</div>
    </div>
    <button class="btn" @click="submit">设置密码</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password1: '',
      password2: ''
    }
  },
  methods: {
    submit() {
      let { password1, password2 } = this
      let regword1 = /^[\d]{6,8}$/
      let regword2 = /^[\d]{6,8}$/
      if (!(regword1.test(password1))) {
        this.$toast('原密码格式不对')
        return
      }
      if (!(regword2.test(password2))) {
        this.$toast('新密码格式不对')
        return
      }
      this.axios({
        url: '/user/updatePwd',
        method: 'POST',
        data: {
          oldPassword: password1,
          newPassword: password2,
          uid: this.$root.uid
        }
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$toast('修改成功');
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
    clearWord1() {
      this.password1 = ''
    },
    clearWord2() {
      this.password2 = ''
    },
  }
}
</script>

<style lang="scss">
.revise {
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