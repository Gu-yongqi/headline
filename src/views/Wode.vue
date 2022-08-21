<template>
  <div class="wode">
    <div v-if="$root.token&&$root.uid">
      <div class="head">
        <div class="headOne">
          <div class="tx">
            <img :src="$root.userInfo.avatar||'/img/logo.png'" alt="">
          </div>
          <div class="title">{{$root.userInfo.nickname||'头条'}}</div>
          <div class="headBtn" @click="$router.push('/info')">编辑资料</div>
        </div>
        <div class="headTwo">
          <div @click="$router.push('/publish')">
            <div style="font-size:18px;">{{count}}</div>
            <div>头条</div>
          </div>
          <div>
            <div style="font-size:18px;">3</div>
            <div>获赞</div>
          </div>
        </div>
      </div>
      <div class="nav">
        <div>
          <div style="margin-top:10px;">
            <van-icon name="star-o" color="#ed6761" size="28px" />
          </div>
          <div style="margin-top:10px;" @click="$router.push('/collection')">收藏</div>
        </div>
        <div>
          <div style="margin-top:10px;">
            <van-icon name="underway-o" color="#ed6761" size="28px" />
          </div>
          <div style="margin-top:10px;" @click="$router.push('/history')">历史</div>
        </div>
      </div>
      <div>
        <van-cell-group @click="$router.push('/revise')">
          <van-cell title="修改密码" is-link />
        </van-cell-group>
        <van-cell-group>
          <van-cell title="联系我们" is-link @click="$toast('功能正在开发中，尽情期待')" />
        </van-cell-group>
        <van-cell-group @click="$router.push('/about')">
          <van-cell title="关于我们" is-link />
        </van-cell-group>
        <div class="btn" @click="btn">退出登录</div>
      </div>
    </div>
    <div v-else @click="$router.push('/login')">
      <div class="head">
        <div class="headOne">
          <div class="tx">
            <img src="/img/A.png" alt="">
          </div>
          <div class="title">登录</div>
          <div class="headBtn">编辑资料</div>
        </div>
        <div class="headTwo">
          <div>
            <div style="font-size:18px;">0</div>
            <div>头条</div>
          </div>
          <div>
            <div style="font-size:18px;">0</div>
            <div>获赞</div>
          </div>
        </div>
      </div>
      <div class="nav">
        <div>
          <div style="margin-top:10px;">
            <van-icon name="star-o" color="#ed6761" size="28px" />
          </div>
          <div style="margin-top:10px;">收藏</div>
        </div>
        <div>
          <div style="margin-top:10px;">
            <van-icon name="underway-o" color="#ed6761" size="28px" />
          </div>
          <div style="margin-top:10px;">历史</div>
        </div>
      </div>
      <div>
        <van-cell-group>
          <van-cell title="修改密码" is-link />
        </van-cell-group>
        <van-cell-group>
          <van-cell title="联系我们" is-link />
        </van-cell-group>
        <van-cell-group>
          <van-cell title="关于我们" is-link />
        </van-cell-group>
      </div>
    </div>
    <van-tabbar v-model="activeFoot" active-color="#07c160" inactive-color="#000" safe-area-inset-bottom placeholder z-index="999" route>
      <van-tabbar-item icon="home-o" to="/">首页</van-tabbar-item>
      <van-tabbar-item icon="add-o" to="/main">发布</van-tabbar-item>
      <van-tabbar-item icon="user-o" to="/wode">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeFoot: 2,
      count: 0,
      list: []
    }
  },
  activated() {
    this.line();
  },
  methods: {
    btn() {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '您确定要退出当前账号吗',
      }).then(() => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('tokenExpired')
        sessionStorage.removeItem('uid')
        sessionStorage.removeItem('userInfo')
        sessionStorage.removeItem('search')
        this.$root.token = ''
        this.$root.uid = ''
        this.$root.userInfo = {}
      })
    },
    line() {
      this.axios({
        url: '/api/get_user_article_list',
        method: 'GET',
        params: {
          uid: this.$root.userInfo._id,
          skip: 0,
          limit: 100
        }
      }).then(res => {
        console.log(res);
        this.count = res.data.count
      })
    }
  }
}
</script>

<style lang="scss">
.wode {
  background-color: #f6f6f6;
  height: 100vh;
  .head {
    width: 100vw;
    height: 26vh;
    background-color: #07c160;
    .headOne {
      padding-top: 38px;
      overflow: hidden;
      .tx {
        float: left;
        margin-left: 20px;
        img {
          width: 70px;
          height: 70px;
          border-radius: 50%;
        }
      }
      .title {
        float: left;
        margin-left: 10px;
        margin-top: 30px;
        color: #fff;
      }
      .headBtn {
        margin-top: 30px;
        margin-right: 10px;
        font-size: 12px;
        text-align: center;
        line-height: 28px;
        float: right;
        width: 78px;
        height: 28px;
        background-color: #fff;
        border-radius: 18px;
        color: #434343;
      }
    }
    .headTwo {
      display: flex;
      justify-content: space-around;
      align-items: center;
      text-align: center;
      color: #fff;
      margin-top: 10px;
      font-size: 14px;
    }
  }
  .nav {
    width: 100vw;
    height: 12vh;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    text-align: center;
    margin-bottom: 5px;
    font-size: 14px;
    background-color: #fff;
  }
  .btn {
    width: 100vw;
    height: 42px;
    line-height: 42px;
    margin-top: 5px;
    text-align: center;
    color: red;
    font-size: 12px;
    background-color: #fff;
  }
}
</style>