import layouts from '@/layouts/layouts.vue'
export default {
    path: '/bar',
    name: 'bar',
    redirect: '/barChart',
    component: layouts,
    meta: {
        title: '柱状图',
    },
    children: [
        {
            path: '/barChart',
            name: 'barChart',
            component: () => import('@/views/barChart/barChart.vue'),
            meta: {
                title: '柱状图-基础'
            }
        },
        {
            path: '/horizontalBar',
            name: 'horizontalBar',
            component: () => import('@/views/horizontalBar/horizontalBar.vue'),
            meta: {
                title: '柱状图-横向'
            }
        },
        {
            path: '/loopHorizontalBarChart',
            name: 'loopHorizontalBarChart',
            component: () => import('@/views/loopHorizontalBarChart/loopHorizontalBarChart.vue'),
            meta: {
                title: '柱状图-循环横向'
            }
        },
        {
            path: '/stackBarChart',
            name: 'stackBarChart',
            component: () => import('@/views/stackBarChart/stackBarChart.vue'),
            meta: {
                title: '柱状图-堆叠(竖)'
            }
        },
        {
            path: '/horizontalStackBarChart',
            name: 'horizontalStackBarChart',
            component: () => import('@/views/horizontalStackBarChart/horizontalStackBarChart.vue'),
            meta: {
                title: '柱状图-堆叠(横)'
            }
        },
        {
            path: '/spFuncStackBarChart',
            name: 'spFuncStackBarChart',
            component: () => import('@/views/spFuncStackBarChart/spFuncStackBarChart.vue'),
            meta: {
                title: '柱状图-点击功能示例'
            }
        },
    ]
}
