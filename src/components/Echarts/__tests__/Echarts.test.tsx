import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Echarts from '../Echarts.vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

// Mock ECharts
vi.mock('echarts', () => {
    const mockChartInstance = {
        init: vi.fn(),
        on: vi.fn(),
        getZr: vi.fn(() => ({
            on: vi.fn()
        })),
        showLoading: vi.fn(),
        hideLoading: vi.fn(),
        setOption: vi.fn(),
        resize: vi.fn(),
        dispose: vi.fn()
    }
    const mockEcharts = {
        init: vi.fn(() => mockChartInstance)
    }
    return {
        ...mockEcharts,
        default: mockEcharts
    }
})

// Mock 工具函数
vi.mock('../../utils/rem2px', () => ({
    default: vi.fn((value: number) => value * 16) // 简单模拟rem转px
}))
describe('Echarts.vue', () => {
    const defaultOption: EChartsOption = {
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: [120, 200, 150, 80, 70, 110, 130],
                type: 'bar'
            }
        ]
    }
    beforeEach(() => {
        vi.clearAllMocks()
        // 模拟窗口resize事件
        window.addEventListener = vi.fn((event, handler) => {
            if (event === 'resize') {
                (window as any).resizeHandler = handler
            }
        })
        window.removeEventListener = vi.fn()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('渲染组件', () => {
        const wrapper = mount(Echarts, {
            props: {
                option: defaultOption
            }
        })
        // 判断组件是否成功挂载到dom
        expect(wrapper.exists()).toBe(true)
        // 判断组件是否有正确的class
        expect(wrapper.classes()).toContain('EaconComponentsEcharts')
    })

    it('初始化echarts实例', async () => {
        mount(Echarts, {
            props: {
                option: defaultOption
            }
        })
        // 等待所有异步操作（onMounted、nextTick）完成
        await flushPromises();
        // 验证echarts.init是否被调用
        expect(echarts.init).toHaveBeenCalledTimes(1)
        expect(echarts.init).toHaveBeenCalledWith(expect.anything())
    })

    it('正确处理loading状态', async () => {
        const wrapper = mount(Echarts, {
            props: {
                option: defaultOption,
                shoLoading: true,
                loadingOptions: { text: 'Loading...' }
            }
        })
        await flushPromises()
        const initMock: any = echarts.init;
        // 获取模拟的图表实例
        const chartInstance = initMock.mock.results[0].value;
        expect(chartInstance.showLoading).toHaveBeenCalledWith('default', { text: 'Loading...' })
    })

    it('数据更新，调用setOption', async () => {
        const wrapper = mount(Echarts, {
            props: {
                option: defaultOption
            }
        })

        await flushPromises()
        const initMock: any = echarts.init;
        const chartInstance = initMock.mock.results[0].value
        chartInstance.setOption.mockClear()

        // 更新props
        await wrapper.setProps({
            option: {
                ...defaultOption,
                series: [{ data: [10, 20, 30], type: 'bar' }]
            }
        })

        await flushPromises()
        // option变更后重新调用setOption
        expect(chartInstance.setOption).toHaveBeenCalledTimes(1)
        expect(chartInstance.setOption).toHaveBeenCalledWith(expect.anything(), { notMerge: true })
    })

    it('图表点击事件', async () => {
        const wrapper = mount(Echarts, {
            props: {
                option: defaultOption
            }
        })

        await flushPromises()

        const initMock: any = echarts.init;
        // 图表实例
        const chartInstance = initMock.mock.results[0].value

        // 模拟图表点击事件
        const clickHandler = chartInstance.on.mock.calls.find((call: string[]) => call[0] === 'click')[1]
        const mockParams = { data: 'test' }
        clickHandler(mockParams)

        expect(wrapper.emitted('clickEffective')).toHaveLength(1)
        expect(wrapper.emitted('clickEffective')).toEqual([[mockParams]])
    })
})

// describe('EchartsComponent', () => {



//     it('should handle window resize event', async () => {
//         mount(EchartsComponent, {
//             props: {
//                 option: defaultOption
//             }
//         })

//         await vi.runAllTimers()
//         const chartInstance = echarts.init.mock.results[0].value

//             // 模拟窗口 resize
//             (window as any).resizeHandler()

//         expect(chartInstance.resize).toHaveBeenCalledTimes(1)
//     })

//     it('should dispose chart instance on unmount', async () => {
//         const wrapper = mount(EchartsComponent, {
//             props: {
//                 option: defaultOption
//             }
//         })

//         await vi.runAllTimers()
//         const chartInstance = echarts.init.mock.results[0].value

//         await wrapper.unmount()
//         expect(chartInstance.dispose).toHaveBeenCalledTimes(1)
//         expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.anything())
//     })

//     it('should convert rem to px correctly', async () => {
//         const remToPx = await import('../../utils/rem2px').then(m => m.default)
//         const testOption = {
//             ...defaultOption,
//             title: {
//                 text: 'Test',
//                 left: 1, // 应该被转换
//                 top: 2,  // 应该被转换
//                 textStyle: {
//                     fontSize: 1.25 // 应该被转换
//                 }
//             }
      
//       mount(EchartsComponent, {
//                 props: {
//                     option: testOption
//                 }
//             })
      
//       await vi.runAllTimers()

//       // 检查是否调用了remToPx转换相关属性
//       expect(remToPx).toHaveBeenCalledWith(1)
//       expect(remToPx).toHaveBeenCalledWith(2)
//       expect(remToPx).toHaveBeenCalledWith(1.25)
//         })
// })
// })
