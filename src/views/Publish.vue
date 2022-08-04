<template>
  <div class="publish">
    <van-nav-bar left-arrow @click-left="$router.back()" title="我的发布" placeholder fixed z-index="999" />
    <div v-if="small">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
    <div v-else>
      <div v-if="list.length==0">
        <van-empty image="search" description="暂无此列表" />
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh" style="min-height: 100vh;">
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          <div>
            <div class="content" v-for="(item,index) in list" :key="index" @click="essay(item._id,item.title,item.author,item.imageSrc,item.time,item.comment,item.like,item.fav)">
              <div class="one">{{item.title}}</div>
              <div v-for="(item2,index2) in item.imageSrc" :key="index2" class="two">
                <img :src="item2" alt="">
              </div>
              <div class="thr">
                <div>{{item.author}}</div>
                <div>{{item.comment}}评论</div>
                <div @click.stop="remove(item._id)">删除</div>
                <div>{{new Date(item.time).getFullYear()+'-'+(new Date(item.time).getMonth()+1)+'-'+new Date(item.time).getDate()}}</div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      small: true,
      list: [],
      count: 3,
      loading: false,
      finished: false,
      refreshing: false,
      num: 0
    }
  },
  activated() {
    this.headline();
  },
  methods: {
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
    headline() {
      this.axios({
        url: '/api/get_user_article_list',
        method: 'GET',
        params: {
          uid: this.$root.userInfo._id,
          skip: 0,
          limit: this.count
        }
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.list = res.data.data
          this.num = res.data.count
          this.small = false
        }
      })
    },
    onLoad() {
      setTimeout(() => {
        if (this.refreshing) {
          this.list = [];
          this.refreshing = false;
        }
        for (let i = 0; i < 1; i++) {
          this.count += 3;
          this.headline();
        }
        this.loading = false;
        if (this.list.length >= this.num) {
          this.finished = true;
        }
      }, 1000);
    },
    onRefresh() {
      setTimeout(() => {
        this.$toast('刷新成功');
        this.refreshing = false;
        this.headline();
      }, 1000);
    },
    remove(_id) {
      this.$dialog.confirm({
        title: '删除',
        message: '删除的内容将不可修复，是否继续删除',
      }).then(() => {
        this.axios({
          url: '/api/del_user_article',
          method: 'POST',
          data: {
            _id,
            uid: this.$root.userInfo._id
          }
        }).then(res => {
          console.log(res);
          this.$toast('删除成功');
          this.headline();
        })
      }).catch(() => {
        this.$toast('取消删除')
      });
    }
  }
}
</script>

<style lang="scss">
.publish {
  .content {
    border-bottom: 2px solid #f6f6f6;
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