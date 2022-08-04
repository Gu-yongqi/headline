<template>
  <div class="reply">
    <van-nav-bar :title="count+'条回复'" left-arrow @click-left="$router.back()" placeholder fixed z-index="999" />
    <div class="one">
      <div class="tx">
        <img :src="info.avatar||'/img/A.png'" alt="">
      </div>
      <div class="bt">
        <div>{{info.nickname}}</div>
        <div>{{new Date(Number(list.create_time)).getFullYear()+'-'+(new Date(Number(list.create_time)).getMonth()+1)+'-'+new Date(Number(list.create_time)).getDate()}}</div>
      </div>
      <div class="btn" v-if="guanzhu" @click="guanzhu=!guanzhu">
        <span style="color:red;">关注</span>
      </div>
      <div class="btn" v-else @click="guanzhu=!guanzhu">
        <span>已关注</span>
      </div>
    </div>
    <div v-if="small">
      <van-loading size="24px" vertical>加载中...</van-loading>
    </div>
    <div v-else>
      <div v-if="reply_list.length==0">
        <van-empty class="custom-image" image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="暂无评论" />
      </div>
      <div class="content2" v-else v-for="(item,index) in reply_list" :key="item._id">
        <div class="tx2">
          <img :src="item.info.avatar" alt="">
          <span>{{item.info.nickname}}</span>
          <div style="display:inline-block;position: absolute;right:50px;top:8px;">
            <span>{{item.like_count}}</span>
            <van-icon name="good-job-o" size="18px" style="margin-left:8px;" @click.stop="linkCount(item.user_id,item._id,index)" :class="item.is_like?'like':''" />
          </div>
        </div>
        <div class="text2">{{item.content}}</div>
        <div class="date2">
          <span @click.stop="huifu(item._id)">回复</span>
          <div>{{new Date(item.create_time).getFullYear()+'-'+(new Date(item.create_time).getMonth()+1)+'-'+new Date(item.create_time).getDate()}}</div>
        </div>
      </div>
    </div>
    <van-popup v-model="show" :style="{ width: '100%',top:'40%'}">
      <van-field v-model="message" rows="2" autosize type="textarea" placeholder="请输入评论" v-if="flag" class="field" />
      <van-button type="primary" block @click="comments">确定</van-button>
    </van-popup>
  </div>
</template>

<script>
import Vue from 'vue';
import { Empty } from 'vant';

Vue.use(Empty);
export default {
  data() {
    return {
      list: [],
      info: [],
      count: 0,
      guanzhu: true,
      reply_list: [],
      small: true,
      flag: false,
      show: false,
      message: '',
      user_id: '',
      article_id: '',
      _id: ''
    }
  },
  mounted() {
    let item = this.$route.query.item
    this.list = JSON.parse(item)
    this.info = JSON.parse(item).info
    this.user_id = this.$route.query.user_id
    this.article_id = this.$route.query.article_id
    this.get_reply_list();
  },
  methods: {
    get_reply_list() {
      this.axios({
        url: '/api/get_reply_list',
        method: 'POST',
        data: {
          article_id: this.list.article_id,
          skip: 0,
          limit: 100,
          reply_comment_id: this.list._id,
          user_id: this.list.user_id
        }
      }).then(res => {
        console.log(res);
        this.count = res.data.count
        this.reply_list = res.data.data
        this.small = false
      })
    },
    linkCount(user_id, _id, i) {
      if (!this.reply_list[i].is_like) {
        //评论点赞成功
        this.axios({
          url: '/api/comment_like',
          method: 'POST',
          data: {
            comment_id: _id,
            user_id: user_id
          }
        }).then(res => {
          console.log(res);
          this.reply_list[i].like_count += 1
          this.reply_list[i].is_like = !this.reply_list[i].is_like
          this.$forceUpdate();
          this.$toast('点赞成功')
        })
      } else {
        //评论取消点赞
        this.axios({
          url: '/api/comment_unlike',
          method: 'POST',
          data: {
            comment_id: _id,
            user_id: user_id
          }
        }).then(res => {
          console.log(res);
          this.reply_list[i].like_count -= 1
          this.reply_list[i].is_like = !this.reply_list[i].is_like
          this.$forceUpdate();
          this.$toast('取消点赞')
        })
      }
    },
    huifu(_id) {
      this._id = _id;
      this.flag = true;
      this.show = true;
    },
    comments() {
      this.axios({
        url: '/api/add_comment',
        method: 'POST',
        data: {
          user_id: this.$root.userInfo._id,
          article_id: this.article_id,
          comment_type: 1,
          reply_comment_id: this.list._id,
          content: this.message
        }
      }).then(res => {
        console.log(res);
        if (res.data.code == 0) {
          this.$toast('评论成功')
          this.message = ''
          this.show = false
          this.get_reply_list();
        }
      })
    },
  }
}
</script>

<style lang="scss">
.reply {
  width: 100vw;
  overflow: hidden;
  .like {
    color: red;
  }
  .one {
    border-bottom: 1px solid #f6f6f6;
    padding-bottom: 10px;
    overflow: hidden;
    margin: 20px 0;
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
  .content2 {
    margin: 20px 0 30px;
    border-bottom: 1px solid #f6f6f6;
    font-size: 12px;
    .tx2 {
      position: relative;
      margin-left: 40px;
      img {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        vertical-align: -15px;
      }
      span {
        color: #6db0e0;
        margin-left: 10px;
      }
    }
    .text2 {
      width: 62vw;
      margin: 0 auto;
      line-height: 24px;
      font-size: 14px;
    }
    .date2 {
      margin: 10px 0;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
}
</style>