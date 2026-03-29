import { createRouter, createWebHistory } from 'vue-router'
import pkIndexView from '@/views/pk/PkIndexView'
import RecordIndexView from '@/views/record/RecordIndexView'  
import RanklistIndexView from '@/views/ranklist/RanklistIndexView'
import UserBotIndexView from '@/views/user/bot/UserBotIndexView'
import NotFound from '@/views/error/NotFound'

const routes = [
  {
    path: '/',
    redirect: '/pk/',
    name: 'home'
  },
  {
    path: '/pk/',
    name: 'pk_index',
    component: pkIndexView
  },
  {
    path: '/record/',
    name: 'record_index',
    component: RecordIndexView
  },
  {
    path: '/ranklist/',
    name: 'ranklist_index',
    component: RanklistIndexView
  },
  {
    path: '/user/bot/',
    name: 'user_bot_index',
    component: UserBotIndexView
  },
  {
    path: '/404/',
    name: 'not_found_index',
    component: NotFound
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
