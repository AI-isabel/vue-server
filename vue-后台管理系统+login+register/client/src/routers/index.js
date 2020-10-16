import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import h from '@/views/Home.vue';
import main from '@/views/articles/main.vue';
import s from '@/views/articles/showLink.vue';
import c from '@/views/articles/createLink.vue';
import e from '@/views/articles/editLink.vue';

import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', redirect:'/home' },//一级路由
        { path: '/home', component: h , children:[
            { path: '', component: main },//二级路由与二级router-view匹配
            { path: '/show-link', component: s },
            { path: '/create-link', component: c },
            { path: '/edit-link/:id', component: e },
        ]},
        { path: '/login', name:'LoginPage', component: Login },
        { path: '/register', component: Register }
    ]
});

export default router;