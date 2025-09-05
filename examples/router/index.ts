import { createRouter, createWebHistory } from 'vue-router'
import layouts from '@/layouts/layouts.vue'

import bar from './modules/bar.ts'
import line from './modules/line.ts'
import mix from './modules/mix.ts'

export const routes = [
  {
    path: '/',
    name: '',
    redirect: '/',
    component: layouts,
    meta: {
      title: '首页',
      hideChildren: true,
      showLog: false
    },
    children: [
      {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/home.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  },
  {
    path: '/echarts',
    name: 'echartsRoot',
    redirect: '/echarts',
    component: layouts,
    meta: {
      title: '基类图表',
      hideChildren: true,
      showLog: false
    },
    children: [
      {
        path: '/echarts',
        name: 'echarts',  
        component: () => import('@/views/echarts/echarts.vue'),
        meta: {
          title: '首页'
        }
      }
    ]
  },
  bar,
  line,
  mix
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
