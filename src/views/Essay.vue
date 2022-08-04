<template>
  <div class="essay">
    <van-nav-bar title="文章详情" left-arrow @click-left="$router.back()" placeholder fixed z-index="999" />
    <h2>{{title}}</h2>
    <div class="one">
      <div class="tx">
        <img :src="avatar||'/img/A.png'" alt="">
      </div>
      <div class="bt">
        <div>{{author}}</div>
        <div>{{new Date(Number(time)).getFullYear()+'-'+(new Date(Number(time)).getMonth()+1)+'-'+new Date(Number(time)).getDate()}}</div>
      </div>
      <div class="btn" v-if="guanzhu" @click="guanzhu=!guanzhu">
        <span style="color:red;">关注</span>
      </div>
      <div class="btn" v-else @click="guanzhu=!guanzhu">
        <span>已关注</span>
      </div>
    </div>
    <div class="two">
      <div class="title" v-for="(item,index) in imageSrc" :key="index">
        <img :src="item" alt="">
      </div>
      <div style="margin:20px 10px;font-size:14px;">{{content}}</div>
      <div v-if="small">
        <van-loading size="24px" vertical>加载中...</van-loading>
      </div>
      <div v-else>
        <div v-if="list.length==0">
          <van-empty class="custom-image" image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="暂无评论" />
        </div>
        <div class="content" v-for="(item,index) in list" :key="item._id" v-else @click="$router.push({path:'/reply',query:{item:JSON.stringify(item),user_id:item.user_id,article_id:item.article_id}})">
          <div class="tx">
            <img :src="item.info.avatar" alt="">
            <span>{{item.info.nickname}}</span>
            <div style="display:inline-block;position: absolute;right:50px;top:12px;">
              <span>{{item.like_count}}</span>
              <van-icon name="good-job-o" size="22px" style="margin-left:16px;" @click.stop="linkCount(item._id,index)" :class="item.is_like?'like':''" />
            </div>
          </div>
          <div class="text">{{item.content}}</div>
          <div class="date">
            <span @click.stop="huifu(item.user_id,item._id,index)">回复</span>
            <div>{{new Date(item.create_time).getFullYear()+'-'+(new Date(item.create_time).getMonth()+1)+'-'+new Date(item.create_time).getDate()}}</div>
          </div>
        </div>
      </div>
    </div>
    <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
    <footer>
      <input type="text" readonly placeholder="写评论" @click="flag=true,show=true,type=0">
      <van-popup v-model="show" :style="{ width: '100%',top:'40%'}">
        <van-field v-model="message" rows="2" autosize type="textarea" placeholder="请输入评论" v-if="flag" class="field" />
        <van-button type="primary" block @click="comments">确定</van-button>
      </van-popup>
      <van-icon name="comment-o" size="22px" style="margin-left:16px;vertical-align:-5px;" @click="com" />
      <van-icon name="star-o" size="22px" style="margin-left:16px;vertical-align:-5px;" @click="star" :class="flagStar?'star':''" />
      <van-icon name="good-job-o" size="22px" style="margin-left:16px;vertical-align:-5px;" @click="good" :class="flagLink?'like':''" />
      <van-icon name="share-o" size="22px" style="margin-left:16px;vertical-align:-5px;" @click="showShare = true" />
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      small: true,
      content: '',
      avatar: '',
      user_id: '',
      comment_id: '',
      i: '',
      type: 0,
      list: [],
      guanzhu: true,
      show: false,
      flag: false,
      flagStar: false,
      flagLink: false,
      showShare: false,
      _id: '',
      title: '',
      author: '',
      imageSrc: [],
      time: '',
      comment: '',
      like: '',
      fav: '',
      message: '',
      options: [
        { name: '微信', icon: 'wechat' },
        { name: '朋友圈', icon: 'wechat-moments' },
        { name: '微博', icon: 'weibo' },
        { name: 'QQ', icon: 'qq' },
        { name: '复制链接', icon: 'link' },
        { name: '分享海报', icon: 'poster' },
        { name: '二维码', icon: 'qrcode' },
        { name: '小程序码', icon: 'weapp-qrcode' }
      ],
    }
  },
  mounted() {
    this.flagStar = JSON.parse(sessionStorage.getItem('is_fav'));
    this.flagLink = JSON.parse(sessionStorage.getItem('is_like'));
    this.content = this.$route.query.content;
    this.avatar = this.$route.query.avatar;
    this._id = this.$route.query._id;
    this.title = this.$route.query.title;
    this.author = this.$route.query.author;
    let imageSrc = this.$route.query.imageSrc;
    this.imageSrc = JSON.parse(imageSrc)
    this.time = this.$route.query.time;
    this.comment = this.$route.query.comment;
    this.like = this.$route.query.like;
    this.fav = this.$route.query.fav;
    this.commList();
  },
  methods: {
    huifu(user_id, comment_id, i) {
      this.user_id = user_id;
      this.comment_id = comment_id;
      this.i = i;
      this.flag = true;
      this.show = true
      this.type = 1;
    },
    linkCount(_id, i) {
      if (!this.list[i].is_like) {
        //评论点赞成功
        this.axios({
          url: '/api/comment_like',
          method: 'POST',
          data: {
            comment_id: _id,
            user_id: this.$root.userInfo._id
          }
        }).then(res => {
          console.log(res);
          this.list[i].like_count += 1
          this.list[i].is_like = !this.list[i].is_like
          this.$toast('点赞成功')
        })
      } else {
        //评论取消点赞
        this.axios({
          url: '/api/comment_unlike',
          method: 'POST',
          data: {
            comment_id: _id,
            user_id: this.$root.userInfo._id
          }
        }).then(res => {
          console.log(res);
          this.list[i].like_count -= 1
          this.list[i].is_like = !this.list[i].is_like
          this.$toast('取消点赞')
        })
      }
    },
    commList() {
      //评论列表
      this.axios({
        url: '/api/get_comment_list',
        method: 'POST',
        data: {
          article_id: this._id,
          skip: 0,
          limit: 100,
          user_id: this.$root.userInfo._id
        }
      }).then(res => {
        console.log(res);
        this.list = res.data.data
        this.small = false
      })
    },
    com() {
      if (document.querySelector('.content')) {
        document.querySelector('.content').scrollIntoView()
      }
    },
    star() {
      if (this.flagStar) {
        //取消收藏
        this.axios({
          url: '/api/remove_fav',
          method: 'POST',
          data: {
            article_id: this._id,
            user_id: this.$root.userInfo._id
          }
        }).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.flagStar = !this.flagStar
            sessionStorage.setItem('is_fav', this.flagStar);
            this.$toast('取消收藏')
          }
        })
      } else {
        //收藏成功
        this.axios({
          url: '/api/add_fav',
          method: 'POST',
          data: {
            article_id: this._id,
            user_id: this.$root.userInfo._id
          }
        }).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.flagStar = !this.flagStar
            sessionStorage.setItem('is_fav', this.flagStar);
            this.$toast('收藏成功')
          }
        })
      }
    },
    good() {
      if (this.flagLink) {
        //取消点赞
        this.axios({
          url: '/api/unlike',
          method: 'POST',
          data: {
            article_id: this._id,
            user_id: this.$root.userInfo._id
          }
        }).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.flagLink = !this.flagLink
            sessionStorage.setItem('is_like', this.flagLink);
            this.$toast('取消点赞')
          }
        })
      } else {
        //点赞成功
        this.axios({
          url: '/api/like',
          method: 'POST',
          data: {
            article_id: this._id,
            user_id: this.$root.userInfo._id
          }
        }).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.flagLink = !this.flagLink
            sessionStorage.setItem('is_like', this.flagLink);
            this.$toast('点赞成功')
          }
        })
      }
    },
    comments() {
      if (this.type == 1) {
        this.axios({
          url: '/api/add_comment',
          method: 'POST',
          data: {
            user_id: this.$root.userInfo._id,
            article_id: this._id,
            comment_type: this.type,
            reply_comment_id: this.comment_id,
            content: this.message
          }
        }).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.$toast('评论成功')
            this.message = ''
            this.show = false
            this.commList();
          }
        })
      } else {
        this.axios({
          url: '/api/add_comment',
          method: 'POST',
          data: {
            user_id: this.$root.userInfo._id,
            article_id: this._id,
            comment_type: this.type,
            reply_comment_id: '',
            content: this.message
          }
        }).then(res => {
          console.log(res);
          if (res.data.code == 0) {
            this.$toast('评论成功')
            this.message = ''
            this.show = false
            this.commList();
          }
        })
      }
    },
    onSelect(option) {
      this.$toast(option.name);
      this.showShare = false;
    }
  }
}
</script>

<style lang="scss">
.essay {
  overflow: hidden;
  .like {
    color: red;
  }
  .star {
    color: #fdc62f;
  }
  h2 {
    text-align: center;
  }
  .one {
    border-bottom: 1px solid #f6f6f6;
    padding-bottom: 10px;
    overflow: hidden;
    .tx {
      float: left;
      margin-left: 20px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
    }
    .bt {
      float: left;
      font-size: 12px;
      div {
        margin-left: 10px;
      }
      div:nth-of-type(2) {
        margin-top: 10px;
      }
    }
    .btn {
      float: right;
      margin-right: 20px;
      width: 80px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 18px;
      margin-top: 10px;
      span:nth-of-type(1) {
        margin-right: 5px;
      }
      span:nth-of-type(2) {
        font-size: 14px;
      }
    }
  }
  .two {
    height: 70vh;
    word-wrap: break-word;
    overflow-y: scroll;
    .title {
      margin-top: 10px;
      line-height: 24px;
      img {
        width: 100vw;
        height: 100%;
        overflow: hidden;
      }
    }
    .content {
      margin: 20px 0 30px;
      border-bottom: 1px solid #f6f6f6;
      .tx {
        position: relative;
        margin-left: 20px;
        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          vertical-align: -15px;
        }
        span {
          color: #6db0e0;
          margin-left: 10px;
        }
      }
      .text {
        width: 62vw;
        margin: 0 auto;
        line-height: 24px;
        font-size: 14px;
      }
      .date {
        margin: 10px 0;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }
  }
  footer {
    background-color: #fff;
    z-index: 999;
    width: 100vw;
    position: fixed;
    bottom: 0;
    height: 48px;
    line-height: 48px;
    input {
      width: 58vw;
      border-radius: 18px;
      text-align: center;
      height: 24px;
    }
  }
}
</style>