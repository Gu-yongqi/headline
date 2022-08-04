import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import { Icon, Tab, Tabs, Tabbar, TabbarItem, Toast, NavBar, Field, Cell, CellGroup, button, ActionSheet, Popup, DatetimePicker, Uploader, ShareSheet, Search, Dialog, Loading, PullRefresh, List, Empty } from 'vant';

Vue.use(Icon).use(Tab).use(Tabs).use(Tabbar).use(TabbarItem).use(Toast).use(NavBar).use(Field).use(Cell).use(CellGroup).use(button).use(ActionSheet).use(Popup).use(DatetimePicker).use(Uploader).use(ShareSheet).use(Search).use(Dialog).use(Loading).use(PullRefresh).use(List).use(Empty);
Vue.config.productionTip = false
axios.defaults.baseURL = 'https://d33a5037-6c63-4e92-8bb1-30018ab701ea.bspapp.com/http'
Vue.prototype.axios = axios

let token = sessionStorage.getItem('token')
let uid = sessionStorage.getItem('uid')
let tokenExpired = sessionStorage.getItem('tokenExpired')
let sum = new Date().getTime()

if (token && uid && sum < tokenExpired) {
    axios({
        url: '/user/getuserInfo',
        method: 'POST',
        params: {
            token
        }
    }).then(res => {
        console.log(res);
        let { userInfo } = res.data
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
        new Vue({
            router,
            store,
            data: {
                token,
                uid,
                userInfo,
            },
            // created() {
            //     if (this.$root.userInfo.avatar.split('')[4] !== 's') {
            //         this.$root.userInfo.avatar = this.$root.userInfo.avatar.split('')
            //         this.$root.userInfo.avatar.splice(4, 0, 's')
            //         this.$root.userInfo.avatar = this.$root.userInfo.avatar.join('')
            //         return
            //     }
            // },
            render: h => h(App)
        }).$mount('#app')
    })
} else {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('tokenExpired')
    sessionStorage.removeItem('uid')
    sessionStorage.removeItem('userInfo')
    sessionStorage.removeItem('search')
    new Vue({
        router,
        store,
        data: {
            token: '',
            uid: '',
            userInfo: {}
        },
        render: h => h(App)
    }).$mount('#app')
}