<template>
  <div class="search">
    <form action="/">
      <van-search v-model="value" placeholder="请输入搜索关键词" @search="onSearch">
        <template #left>
          <div @click="$router.back()" style="margin-right:10px;">
            <van-icon name="arrow-left" />
          </div>
        </template>
      </van-search>
    </form>
    <van-cell-group>
      <van-cell title="搜索历史"><span @click="deletes">全部删除</span></van-cell>
    </van-cell-group>
    <van-cell-group v-for="(item,index) in arr" :key="index">
      <van-cell :title="item" @click="onSearch(item)">
        <van-icon name="close" @click.stop="delet(index)" />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      arr: []
    }
  },
  mounted() {
    this.arr = JSON.parse(sessionStorage.getItem('search'))
  },
  methods: {
    onSearch(val) {
      this.axios({
        url: '/api/search',
        method: 'POST',
        data: {
          key_word: this.value || val,
          skip: 0,
          limit: 100
        }
      }).then(res => {
        console.log(res);
        let item = res.data.data
        item = JSON.stringify(item)
        this.$router.push({ path: '/detail', query: { item } })
        let flag = this.arr.every(v => v != val);
        let i = this.arr.indexOf(val);
        if (flag) {
          this.arr.unshift(val);
          sessionStorage.setItem('search', JSON.stringify(this.arr))
          this.value = '';
        } else {
          this.arr.splice(i, 1);
          this.arr.unshift(val);
          sessionStorage.setItem('search', JSON.stringify(this.arr))
          this.value = '';
        }
      })
    },
    deletes() {
      this.$dialog.confirm({
        title: '全部删除',
        message: '删除的内容将不可修复，是否继续删除',
      }).then(() => {
        this.arr = []
        sessionStorage.setItem('search', JSON.stringify(this.arr))
        this.$toast('删除成功')
      }).catch(() => {
        this.$toast('取消删除')
      });
    },
    delet(i) {
      this.$dialog.confirm({
        title: '删除',
        message: '删除的内容将不可修复，是否继续删除',
      }).then(() => {
        this.arr.splice(i, 1)
        sessionStorage.setItem('search', JSON.stringify(this.arr))
        this.$toast('删除成功')
      }).catch(() => {
        this.$toast('取消删除')
      });
    }
  }
}
</script>
