import { createRouter, createWebHistory } from 'vue-router'
import layouts from '@/layouts/layouts.vue'

import bar from './modules/bar.ts'
import line from './modules/line.ts'
import mix from './modules/mix.ts'
import gauge from './modules/gauge.ts'
import pie from './modules/pie.ts'

export const routes = [
  {
    path: '/',
    name: '',
    redirect: '/',
    component: layouts,
    meta: {
      title: '首页',
      hideChildren: true,
      showLog: false,
      menu:false
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
  {
    path: '/word',
    name: 'wordRoot',
    redirect: '/word',
    component: layouts,
    meta: {
      title: '文档',
      hideChildren: true,
      showLog: false,
      menu:false
    },
    children: [
      {
        path: '/word',
        name: 'word',
        component: () => import('@/views/word/word.vue'),
        meta: {
          title: '文档'
        }
      }
    ]
  },
  bar,
  line,
  mix,
  gauge,
  pie
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
