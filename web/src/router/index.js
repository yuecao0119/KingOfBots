import { createRouter, createWebHistory } from 'vue-router'
import PKIndexView from '../views/pk/PKIndexView'
import RanklistIndexView from '../views/ranklist/RanklistIndexView'
import RecordIndexView from '../views/record/RecordIndexView'
import UserBotIndexView from '../views/user/bot/UserBotIndexView'
import NotFound from '../views/error/NotFound'

const routes = [
  {
    path: '/', 
    name: 'home',
    redirect: '/pk/' // 重定向到 pk 页面
  },
  {
    path: '/pk/',
    name: 'pk_index',
    component: PKIndexView
  },
  {
    path: '/ranklist/',
    name: 'ranklist_index',
    component: RanklistIndexView
  },
  {
    path: '/record/',
    name:'record_index',
    component: RecordIndexView
  },
  {
    path: '/user/bot/',
    name:'userbot_index',
    component: UserBotIndexView
  },
  {
    path: '/404/',
    name:'404',
    component: NotFound
  },
  {
    path: '/:pathMatch(.*)*', // 这个匹配是从上向下匹配，如果上面都没匹配到，这里会匹配所有，重定向到 404 页面
    redirect: '/404/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
