import layouts from '@/layouts/layouts.vue'
export default {
    path: '/mix',
    name: 'mix',
    redirect: '/mixChart',
    component: layouts,
    meta: {
        title: '混合图',
    },
    children: [
        {
            path: '/mixLineBarChart',
            name: 'mixLineBarChart',
            component: () => import('@/views/mixLineBarChart/mixLineBarChart.vue'),
            meta: {
                title: '混合图-基础'
            }
        },
    ]
}
