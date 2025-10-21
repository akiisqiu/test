import layouts from '@/layouts/layouts.vue'
export default {
    path: '/echarts/mixLineBarChart',
    name: 'mix',
    redirect: '/echarts/mixLineBarChart',
    component: layouts,
    meta: {
        title: '混合图',
    },
    children: [
        {
            path: '/echarts/mixLineBarChart',
            name: 'mixLineBarChart',
            component: () => import('@/views/mixLineBarChart/mixLineBarChart.vue'),
            meta: {
                title: '混合图-基础'
            }
        },
    ]
}
