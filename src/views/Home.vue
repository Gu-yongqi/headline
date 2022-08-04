<template>
  <div class="home">
    <header>
      <div @click="$router.push('/search')">
        <van-icon name="search" />
        <span>搜索</span>
      </div>
    </header>
    <van-tabs v-model="active" title-active-color="#000" animated sticky offset-top="59px" swipeable @click="cli" @rendered.once="cli" style="padding-top:50px;">
      <van-tab :title="item.name" v-for="item in list" :key="item._id">
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height: 100vh;">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-for="item in arr" :key="item._id" class="content" @click="essay(item._id,item.title,item.author,item.imageSrc,item.time,item.comment,item.like,item.fav)">
              <div class="one">{{item.title}}</div>
              <div v-for="(item2,index) in item.imageSrc" :key="index" class="two">
                <img :src="item2" alt="">
              </div>
              <div class="thr">
                <div>{{item.author}}</div>
                <div>{{item.comment}}评论</div>
                <div>{{new Date(item.time).getFullYear()+'-'+(new Date(item.time).getMonth()+1)+'-'+new Date(item.time).getDate()}}</div>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
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
      list: [],
      active: 0,
      activeFoot: 0,
      _id: '',
      arr: [],
      count: 3,
      loading: false,
      finished: false,
      refreshing: false,
      num: 0
    }
  },
  activated() {
    this.getList();
    this.lists();
    this.activeFoot = 0;
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.arr = [];
          this.refreshing = false;
        }
        for (let i = 0; i < 1; i++) {
          this.count += 3;
          this.lists();
        }
        this.loading = false;
        if (this.arr.length >= this.num) {
          this.finished = true;
        }
      }, 1000);
    },
    essay(_id, title, author, imageSrc, time, comment, like, fav) {
      this.axios({
        url: '/api/get_article_detail',
        method: 'POST',
        data: {
          article_id: _id,
          user_id: this.$root.userInfo._id
        }
      }).then(res => {
        console.log(res);
        let avatar = res.data.data.avatar
        let content = res.data.data.content
        sessionStorage.setItem('is_fav', res.data.data.is_fav)
        sessionStorage.setItem('is_like', res.data.data.is_like)
        imageSrc = JSON.stringify(imageSrc)
        this.$router.push({ path: '/essay', query: { content, avatar, _id, title, author, imageSrc, time, comment, like, fav } })
      })
    },
    cli(i) {
      for (i; i < this.list.length; i++) {
        if (i == this.active) {
          this._id = this.list[this.active]._id
          this.lists();
          return
        }
      }
    },
    getList() {
      this.axios({
        url: '/api/get_cate_list',
        method: 'POST'
      }).then(res => {
        console.log(res);
        this.list = res.data.data
      })
    },
    lists() {
      let { _id } = this
      this.axios({
        url: '/api/get_article_list',
        method: 'POST',
        data: {
          cate_id: _id,
          skip: 0,
          limit: this.count
        }
      }).then(res => {
        console.log(res);
        this.arr = res.data.data
        this.num = res.data.count
      })
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.refreshing = false;
        this.lists();
      }, 1000);
    },
  }
};
</script>

<style lang="scss">
.home {
  header {
    position: fixed;
    z-index: 999;
    width: 100vw;
    height: 8vh;
    background-color: #07c160;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      width: 70vw;
      height: 5vh;
      line-height: 5vh;
      background-color: #66d79d;
      margin: 0 auto;
      text-align: center;
      border-radius: 24px;
      color: #fff;
      span {
        margin-left: 5px;
        font-size: 15px;
      }
    }
  }
  .content {
    border-bottom: 2px solid #f6f6f6;
    overflow: hidden;
    .one {
      font-size: 12px;
      margin: 20px 0;
      text-align: center;
    }
    .two {
      img {
        width: 100vw;
        height: 100%;
      }
    }
    .thr {
      margin: 20px 10px;
      font-size: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
}
</style>