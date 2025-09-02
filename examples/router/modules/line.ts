import layouts from '@/layouts/layouts.vue'
export default {
    path: '/line',
    name: 'line',
    redirect: '/lineChart',
    component: layouts,
    meta: {
        title: '折线图',
    },
    children: [
        {
            path: '/lineChart',
            name: 'lineChart',
            component: () => import('@/views/lineChart/lineChart.vue'),
            meta: {
                title: '折线图-基础',
            },
        },
    ]
}