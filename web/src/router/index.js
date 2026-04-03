import { createRouter, createWebHistory } from 'vue-router'
import pkIndexView from '@/views/pk/PkIndexView'
import RecordIndexView from '@/views/record/RecordIndexView'  
import RanklistIndexView from '@/views/ranklist/RanklistIndexView'

import NotFound from '@/views/error/NotFound'
import UserAccountLoginView from '@/views/user/account/UserAccountLoginView.vue'
import UserAccountRegisterView from '@/views/user/account/UserAccountRegisterView.vue'
import store from '@/store'



const routes = [
  {
    path: '/',
    redirect: '/pk/',
    name: 'home',
    meta:{
      requiresAuth: true,
    }
  },
  {
    path: '/pk/',
    name: 'pk_index',
    component: pkIndexView,
        meta:{
      requiresAuth: true,
    }
  },
  {
    path: '/record/',
    name: 'record_index',
    component: RecordIndexView,
    meta:{
      requiresAuth: true,
    }
  },
  {
    path: '/ranklist/',
    name: 'ranklist_index',
    component: RanklistIndexView,
    meta:{
      requiresAuth: true,
    }
  },
  {
    path: '/user/bot/',
    name: 'user_bot_index',
    component: () => import('@/views/user/bot/UserBotIndexView.vue'),
    meta:{
      requiresAuth: true,
    }
  },
  {
    path: '/404/',
    name: 'not_found_index',
    component: NotFound,
    meta:{
      requiresAuth: false,
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404/'
  },
  {
    path: '/user/account/login/',
    name: 'user_account_login',
    component: UserAccountLoginView,
    meta:{
      requiresAuth: false,
    }
  },
  {
    path: '/user/account/register/',
    name: 'user_account_register',
    component: UserAccountRegisterView,
    meta:{
      requiresAuth: false,
    }
  },
  {
    path: '/404/',
    name: 'not_found_index',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.meta.requiresAuth && !store.state.user.is_login) {
    next({name:'user_account_login'});
  }else{
    next();
  }
});



export default router
