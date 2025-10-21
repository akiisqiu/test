import layouts from '@/layouts/layouts.vue'
export default {
    path: '/echarts/bar',
    name: 'bar',
    redirect: '/echarts/barChart',
    component: layouts,
    meta: {
        title: '柱状图',
    },
    children: [
        {
            path: '/echarts/barChart',
            name: 'barChart',
            component: () => import('@/views/barChart/barChart.vue'),
            meta: {
                title: '柱状图-基础'
            }
        },
        {
            path: '/echarts/horizontalBar',
            name: 'horizontalBar',
            component: () => import('@/views/horizontalBar/horizontalBar.vue'),
            meta: {
                title: '柱状图-横向'
            }
        },
        {
            path: '/echarts/loopHorizontalBarChart',
            name: 'loopHorizontalBarChart',
            component: () => import('@/views/loopHorizontalBarChart/loopHorizontalBarChart.vue'),
            meta: {
                title: '柱状图-循环横向'
            }
        },
        {
            path: '/echarts/stackBarChart',
            name: 'stackBarChart',
            component: () => import('@/views/stackBarChart/stackBarChart.vue'),
            meta: {
                title: '柱状图-堆叠(竖)'
            }
        },
        {
            path: '/echarts/horizontalStackBarChart',
            name: 'horizontalStackBarChart',
            component: () => import('@/views/horizontalStackBarChart/horizontalStackBarChart.vue'),
            meta: {
                title: '柱状图-堆叠(横)'
            }
        },
    ]
}
