import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import { Toast } from 'vant';

Vue.use(VueRouter).use(Toast);

const routes = [{
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            keep: true
        }
    },
    {
        path: '/search',
        name: 'search',
        meta: {
            next: true
        },
        component: () =>
            import ('../views/Search.vue')
    },
    {
        path: '/detail',
        name: 'detail',
        meta: {
            next: true,
            keep: true
        },
        component: () =>
            import ('../views/Detail.vue')
    },
    {
        path: '/essay',
        name: 'essay',
        meta: {
            next: true
        },
        component: () =>
            import ('../views/Essay.vue')
    },
    {
        path: '/reply',
        name: 'reply',
        component: () =>
            import ('../views/Reply.vue')
    },
    {
        path: '/main',
        name: 'main',
        meta: {
            next: true
        },
        component: () =>
            import ('../views/Main.vue')
    },
    {
        path: '/wode',
        name: 'wode',
        meta: {
            keep: true
        },
        component: () =>
            import ('../views/Wode.vue')
    },
    {
        path: '/info',
        name: 'info',
        meta: {
            next: true
        },
        component: () =>
            import ('../views/Info.vue')
    },
    {
        path: '/publish',
        name: 'publish',
        meta: {
            keep: true
        },
        component: () =>
            import ('../views/Publish.vue')
    },
    {
        path: '/collection',
        name: 'collection',
        meta: {
            keep: true
        },
        component: () =>
            import ('../views/Collection.vue')
    },
    {
        path: '/history',
        name: 'history',
        meta: {
            keep: true
        },
        component: () =>
            import ('../views/History.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () =>
            import ('../views/About.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ('../views/Login.vue')
    },
    {
        path: '/revise',
        name: 'revise',
        meta: {
            next: true
        },
        component: () =>
            import ('../views/Revise.vue')
    },
    {
        path: '/forget',
        name: 'forget',
        meta: {
            next: true
        },
        component: () =>
            import ('../views/Forget.vue')
    },
    {
        path: '/regin',
        name: 'regin',
        component: () =>
            import ('../views/Regin.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) => {
    let token = sessionStorage.getItem('token')
    let uid = sessionStorage.getItem('uid')
    if (to.meta.next) {
        if (token && uid) {
            next()
        } else {
            Toast('请先登录')
            router.push('/login')
        }
    } else {
        next()
    }
})

export default router