import layouts from '@/layouts/layouts.vue'
export default {
    path: '/echarts/pieChart',
    name: 'pie',
    redirect: '/echarts/pieChart',
    component: layouts,
    meta: {
        title: '饼图',
    },
    children: [
        {
            path: '/echarts/pieChart',
            name: 'pieChart',
            component: () => import('@/views/pie/pie.vue'),
            meta: {
                title: '饼图-基础'
            }
        },
    ]
}
