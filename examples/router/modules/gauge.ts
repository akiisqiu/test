import layouts from '@/layouts/layouts.vue'
export default {
    path: '/echarts/gauge',
    name: 'gauge',
    redirect: '/echarts/gaugeChart',
    component: layouts,
    meta: {
        title: '仪表盘',
    },
    children: [
        {
            path: '/echarts/gaugeChart',
            name: 'gaugeChart',
            component: () => import('@/views/gauge/gauge.vue'),
            meta: {
                title: '仪表盘-基础'
            }
        },
    ]
}
