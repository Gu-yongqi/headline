import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    //静态数据
    state: {
        num: 1,
        _id: ''
    },
    //vue 里的computed
    getters: {},
    //改数据的
    mutations: {
        // add(state, v) {
        //     state.num = v;
        // },
        // change(state, { key, value }) {
        //     state[key] = value
        // }
    },
    //异步操作 请求
    actions: {
        // info(json, token) {
        //     console.log(json);
        //     info({ token }).then(res => {
        //         console.log(res)
        //     })
        // }
    },
    modules: {},
    // import { mapState } from "vuex";
    // computed: {...mapState(['num', '_id']) };
    // this.$store.commit('change', { key: '_id', value: this._id });
    // store.info()
})