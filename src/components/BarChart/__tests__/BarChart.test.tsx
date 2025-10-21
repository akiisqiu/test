import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import BarChart from '../BarChart.vue'
import ChartHeader from '../../ChartHeader/ChartHeader.vue'
import Echarts from '../../Echarts/Echarts.vue'

// Mock ECharts 相关函数
// vi.mock('../../Echarts/ChartConfig', () => ({
//     getBarSeries: vi.fn((item, index, doubleY, colors) => ({
//         name: item.name || `series-${index}`,
//         type: 'bar',
//         data: item.data,
//         yAxisIndex: doubleY ? index : 0,
//         color: colors[index] || '#000'
//     })),
//     createBaseY: vi.fn(() => ({
//         type: 'value',
//         axisLabel: {
//             fontSize: 12
//         }
//     }))
// }))

describe('BarChart.vue', () => {
    let wrapper: VueWrapper<InstanceType<typeof BarChart>>
    const mockProps: any = {
        x: ['Jan', 'Feb', 'Mar'],
        y: [
            { name: 'Series 1', data: [100, 200, 300] },
            { name: 'Series 2', data: [50, 150, 250] }
        ],
        colors: ['#ff0000', '#00ff00'],
        title: 'Test Chart',
        units: ['Unit 1', 'Unit 2'],
        doubleY: false
    }
    beforeEach(() => {
        wrapper = mount(BarChart, {
            props: mockProps,
            global: {
                components: {
                    ChartHeader,
                    Echarts
                }
            }
        })
    })

    // 1. 测试组件渲染
    describe('组件渲染', () => {

        it('子组件渲染', () => {
            expect(wrapper.exists()).toBe(true)
            expect(wrapper.findComponent(ChartHeader).exists()).toBe(true)
            expect(wrapper.findComponent(Echarts).exists()).toBe(true)
        })

        it('标题渲染', () => {
            expect(wrapper.findComponent(ChartHeader).props('title')).toBe('Test Chart')
        })

        it('单位渲染', () => {
            const unitItems = wrapper.findAll('.EaconComponentsBarChartUnitItem')
            expect(unitItems.length).toBe(2)
            expect(unitItems[0].text()).toBe('Unit 1')
            expect(unitItems[1].text()).toBe('Unit 2')
        })
    })

    // // 2. 测试 props 处理
    // describe('Props Handling', () => {
    //     it('handles default props correctly', () => {
    //         const defaultWrapper = mount(BarChart, {
    //             props: {
    //                 x: [],
    //                 y: []
    //             },
    //             global: {
    //                 components: {
    //                     ChartHeader,
    //                     Echarts
    //                 }
    //             }
    //         })

    //         expect(defaultWrapper.props('title')).toBeUndefined()
    //         expect(defaultWrapper.props('colors')).toEqual([])
    //         expect(defaultWrapper.props('doubleY')).toBe(false)
    //     })

    //     it('processes x-axis data correctly', () => {
    //         const option = wrapper.vm.option
    //         expect(option.xAxis.data).toEqual(['Jan', 'Feb', 'Mar'])
    //     })

    //     it('shows placeholder when x-axis data is empty', async () => {
    //         await wrapper.setProps({ x: [] })
    //         const option = wrapper.vm.option
    //         expect(option.xAxis.data).toEqual(['-'])
    //     })
    // })

    // // 3. 测试 computed option
    // describe('Computed Option', () => {
    //     it('generates correct chart option', () => {
    //         const option = wrapper.vm.option

    //         // 验证基本结构
    //         expect(option).toHaveProperty('legend')
    //         expect(option).toHaveProperty('grid')
    //         expect(option).toHaveProperty('xAxis')
    //         expect(option).toHaveProperty('yAxis')
    //         expect(option).toHaveProperty('series')

    //         // 验证系列数据
    //         expect(option.series).toHaveLength(2)
    //         expect(option.series[0].name).toBe('Series 1')
    //         expect(option.series[0].data).toEqual([100, 200, 300])
    //         expect(option.series[1].name).toBe('Series 2')
    //         expect(option.series[1].data).toEqual([50, 150, 250])

    //         // 验证单Y轴配置
    //         expect(option.yAxis).not.toBeInstanceOf(Array)
    //     })

    //     it('handles double Y axis correctly', async () => {
    //         await wrapper.setProps({ doubleY: true })
    //         const option = wrapper.vm.option

    //         // 验证双Y轴配置
    //         expect(option.yAxis).toBeInstanceOf(Array)
    //         expect(option.yAxis).toHaveLength(2)
    //         expect(option.series[0].yAxisIndex).toBe(0)
    //         expect(option.series[1].yAxisIndex).toBe(1)
    //     })
    // })

    // // 4. 测试事件处理
    // describe('Event Handling', () => {
    //     it('emits clickEffective event', async () => {
    //         const echarts = wrapper.findComponent(Echarts)
    //         await echarts.vm.$emit('clickEffective', { data: 'test' })

    //         expect(wrapper.emitted('clickEffective')).toBeTruthy()
    //         expect(wrapper.emitted('clickEffective')[0]).toEqual([{ data: 'test' }])
    //     })

    //     it('emits clickZr event', async () => {
    //         const echarts = wrapper.findComponent(Echarts)
    //         await echarts.vm.$emit('clickZr', { data: 'test' })

    //         expect(wrapper.emitted('clickZr')).toBeTruthy()
    //         expect(wrapper.emitted('clickZr')[0]).toEqual([{ data: 'test' }])
    //     })

    //     it('emits legendSelectChanged event and calls getYAxisMax', async () => {
    //         const mockGetYAxisMax = vi.spyOn(wrapper.vm, 'getYAxisMax')
    //         const echarts = wrapper.findComponent(Echarts)

    //         await echarts.vm.$emit('legendSelectChanged', { selected: true })

    //         expect(wrapper.emitted('legendSelectChanged')).toBeTruthy()
    //         expect(wrapper.emitted('legendSelectChanged')[0]).toEqual([{ selected: true }])
    //         expect(mockGetYAxisMax).toHaveBeenCalled()
    //     })
    // })

    // // 5. 测试 Y 轴最大值计算
    // describe('Y Axis Max Calculation', () => {
    //     it('calls getYAxisMax on mounted', () => {
    //         const mockGetYAxisMax = vi.spyOn(wrapper.vm, 'getYAxisMax')
    //         mount(BarChart, {
    //             props: mockProps,
    //             global: {
    //                 components: {
    //                     ChartHeader,
    //                     Echarts
    //                 }
    //             }
    //         })

    //         expect(mockGetYAxisMax).toHaveBeenCalled()
    //     })

    //     it('calls getYAxisMax when option changes', async () => {
    //         const mockGetYAxisMax = vi.spyOn(wrapper.vm, 'getYAxisMax')
    //         await wrapper.setProps({ y: [{ name: 'New Series', data: [400, 500, 600] }] })

    //         expect(mockGetYAxisMax).toHaveBeenCalled()
    //     })
    // })

    // // 6. 测试 expose 功能
    // describe('Exposed Properties', () => {
    //     it('exposes chart instance', () => {
    //         const exposed = wrapper.vm
    //         expect(exposed.barChart).toBeDefined()
    //     })
    // })
})