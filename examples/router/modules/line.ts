import layouts from '@/layouts/layouts.vue'
export default {
    path: '/echarts/lineChart',
    name: 'line',
    redirect: '/echarts/lineChart',
    component: layouts,
    meta: {
        title: '折线图',
    },
    children: [
        {
            path: '/echarts/lineChart',
            name: 'lineChart',
            component: () => import('@/views/lineChart/lineChart.vue'),
            meta: {
                title: '折线图-基础',
            },
        },
        {
            path: '/echarts/largeScaleLineChart',
            name: 'largeScaleLineChart',
            component: () => import('@/views/largeScaleLineChart/largeScaleLineChart.vue'),
            meta: {
                title: '折线图-大数据量',
            },
        },
    ]
}