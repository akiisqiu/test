import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Echarts from '../Echarts.vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import * as remToPx from '../../../utils/rem2px'

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
        ],
    }
    let spyRemToPx: MockInstance;
    beforeEach(() => {
        vi.clearAllMocks()
        // 模拟窗口resize事件
        window.addEventListener = vi.fn((event, handler) => {
            if (event === 'resize') {
                (window as any).resizeHandler = handler
            }
        })
        window.removeEventListener = vi.fn()
        // 关键：将默认导出的函数包装为对象的属性
        // 监视包装对象上的 remToPx 方法（此时成为对象属性，可被 spyOn 识别）
        spyRemToPx = vi.spyOn(remToPx, 'remToPx');
    })
    afterEach(() => {
        vi.restoreAllMocks()
        // 清理间谍，恢复原函数
        spyRemToPx.mockRestore();
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
        expect(echarts.init).toHaveBeenCalledWith(
            expect.anything(), // 第一个参数
            expect.anything(), // 第二个参数
        )
    })

    it('正确处理loading状态', async () => {
        mount(Echarts, {
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

    it('数据更新,调用setOption', async () => {
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
        // 验证setOption参数
        expect(chartInstance.setOption).toHaveBeenCalledWith(expect.anything(), {
            notMerge: false,
            replaceMerge: ['series']   // 只替换 series，其它配置保留
        })
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

    it('窗口resize事件', async () => {
        mount(Echarts, {
            props: {
                option: defaultOption
            }
        })
        await flushPromises();
        const initMock: any = echarts.init;
        // 图表实例
        const chartInstance = initMock.mock.results[0].value;
        // 触发 resize
        (window as any).resizeHandler()
        await flushPromises();
        expect(chartInstance.resize).toHaveBeenCalledTimes(1)
    })

    it('组件卸载时调用dispose方法', async () => {
        const wrapper = mount(Echarts, {
            props: {
                option: defaultOption
            }
        })
        await flushPromises();
        const initMock: any = echarts.init;
        // 图表实例
        const chartInstance = initMock.mock.results[0].value;
        await wrapper.unmount()
        expect(chartInstance.dispose).toHaveBeenCalledTimes(1)
        // 销毁方法
        expect(window.removeEventListener).toHaveBeenCalledWith('resize', expect.anything())
    })

    it('rem转换', async () => {
        const remArray = [
            'barWidth', 'barMinWidth', 'borderWidth', 'borderRadius', 'margin',
            'left', 'top', 'right', 'bottom', 'fontSize', 'lineHeight', 'width', 'height', 'padding'
        ]
        let i = 0
        let mockRemObj = remArray.reduce((pre: Record<string, number>, cur) => {
            i++;
            pre[cur] = i
            return pre
        }, {})
        const testOption = {
            ...defaultOption,
            mockRem: {
                ...mockRemObj
            }
        }
        mount(Echarts, {
            props: {
                option: testOption
            }
        })
        await flushPromises()
        console.log('调用次数:', spyRemToPx.mock.calls.length);
        spyRemToPx.mock.calls.forEach((args, index) => {
            console.log(`第 ${index + 1} 次调用参数:`, args);
        });
        // 检查是否调用了remToPx转换相关属性
        remArray.forEach((_, index) => {
            expect(spyRemToPx).toHaveBeenCalledWith(index + 1)
        })
    })
})
