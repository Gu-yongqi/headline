<template>
  <div class="detail">
    <van-nav-bar left-arrow @click-left="$router.back()" title="搜索详情" placeholder fixed z-index="999" />
    <div v-if="list.length>0">
      <div class="content" v-for="(item,index) in list" :key="index" @click="essay(item._id,item.title,item.author,item.imageSrc,item.time,item.comment,item.like,item.fav)">
        <div class="one">{{item.title}}</div>
        <div v-for="(item2,index2) in item.imageSrc" :key="index2" class="two">
          <img :src="item2" alt="">
        </div>
        <div class="thr">
          <div>{{item.author}}</div>
          <div>{{item.comment}}评论</div>
          <div>{{new Date(item.time).getFullYear()+'-'+(new Date(item.time).getMonth()+1)+'-'+new Date(item.time).getDate()}}</div>
        </div>
      </div>
    </div>
    <div v-else>
      <van-empty image="search" description="暂无此列表" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  activated() {
    this.list = JSON.parse(this.$route.query.item)
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
  }
}
</script>

<style lang="scss">
.detail {
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