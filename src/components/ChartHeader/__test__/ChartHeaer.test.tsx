import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import ChartHeader, { type IYOption } from '../ChartHeader.vue'
import { ElPopover } from 'element-plus'

// 模拟 echarts 实例
const mockChart: any = {
    dispatchAction: vi.fn()
}

describe('ChartHeader.vue', () => {
    it('渲染标题', async () => {
        const title = '测试标题'
        const wrapper = mount(ChartHeader, {
            props: {
                title: title,
                y: [],
                colors: [],
                chart: null
            },
            global: {
                components: { ElPopover }
            }
        })
        await flushPromises()
        expect(wrapper.find('.chartTitle').text()).toBe(title)
    })

    it('y为空时不渲染图例', () => {
        const wrapper = mount(ChartHeader, {
            props: {
                title: '测试标题',
                y: [],
                colors: [],
                chart: null
            },
            global: {
                components: { ElPopover }
            }
        })

        expect(wrapper.findComponent(ElPopover).exists()).toBe(false)
    })

    describe('图例交互', () => {
        let wrapper: VueWrapper<InstanceType<typeof ChartHeader>>
        const yItems: IYOption[] = [
            { name: 'Series 1', itemType: 'bar', data: [1, 2, 3] },
            { name: 'Series 2', itemType: 'line', data: [4, 5, 6] }
        ]

        beforeEach(() => {
            wrapper = mount(ChartHeader, {
                props: {
                    title: 'Test',
                    y: yItems,
                    colors: ['#ff0000', '#00ff00'],
                    chart: mockChart
                },
                global: {
                    components: { ElPopover }
                }
            })
        })

        it('正确渲染图例', () => {
            const legendItems = wrapper.findAll('.chartLegendItem')
            expect(legendItems.length).toBe(yItems.length)

            yItems.forEach((item, index) => {
                // 检查图例项的文本是否包含正确的名称
                expect(legendItems[index].text()).toContain(item.name)
            })
        })

        it('图例点击事件', async () => {
            const firstItem = wrapper.find('.chartLegendItem')
            await firstItem.trigger('click')
            // 检查 dispatchAction 是否被调用
            expect(mockChart.dispatchAction).toHaveBeenCalledWith({
                type: 'legendToggleSelect',
                name: yItems[0].name
            })
            // 检查图例项的类名是否包含 hidden
            expect(firstItem.classes()).toContain('hidden')
            await firstItem.trigger('click')
            expect(firstItem.classes()).not.toContain('hidden')
        })
    })

    describe('响应式布局', () => {
        it('根据容器宽度计算显示是否正确', async () => {
            // 模拟 DOM 尺寸
            const mockOffsetWidth = 200

            const wrapper: VueWrapper<any> = mount(ChartHeader, {
                props: {
                    title: 'Test',
                    y: [
                        { name: 'Series 1', data: [1, 2, 3] },
                        { name: 'Series 2', data: [4, 5, 6] },
                        { name: 'Series 3', data: [7, 8, 9] },
                        { name: 'Series 4', data: [7, 8, 9] },  
                    ],
                    colors: ['#ff0000', '#00ff00', '#0000ff'],
                    chart: null
                },
                global: {
                    components: { ElPopover }
                },
                attachTo: document.body
            })

            // 模拟 DOM 方法
            Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
                configurable: true,
                value: mockOffsetWidth
            })

            // 触发 resize 计算
            window.dispatchEvent(new Event('resize'))
            // 等待所有异步操作（onMounted、nextTick）完成
            await flushPromises();

            // 验证 showMore 状态
            expect(wrapper.vm.showMore).toBe(true)        
            // 验证 showY 计算
            // 断言实际值是否小于接收值。如果数值相等，则测试失败
            expect(wrapper.vm.showY).toBeLessThan(wrapper.props('y').length)
        })
    })

    describe('Popover内容', () => {
        it('弹窗渲染所有图例', async () => {
            const yItems: IYOption[] = [
                { name: 'Series 1', itemType: 'bar', data: [1, 2, 3] },
                { name: 'Series 2', itemType: 'line', data: [4, 5, 6] },
                { name: 'Series 3', itemType: 'bar', data: [7, 8, 9] },
                { name: 'Series 4', itemType: 'bar', data: [7, 8, 9] },
                { name: 'Series 5', itemType: 'bar', data: [7, 8, 9] },
                { name: 'Series 6', itemType: 'bar', data: [7, 8, 9] },
            ]

            const wrapper: VueWrapper<any> = mount(ChartHeader, {
                props: {
                    title: 'Test',
                    y: yItems,
                    colors: ['#ff0000', '#00ff00', '#0000ff', '#ff0000', '#00ff00', '#0000ff'],
                    chart: null
                },
                global: {
                    components: { ElPopover }
                }
            })
            await flushPromises();
            // 获取弹出框内容
            const popoverContent = wrapper.findComponent(ElPopover)?.vm?.$slots?.default?.('')

            const childList = popoverContent[0].children[0].children

            const popoverItems = childList.filter(
                (node: any) => node.props?.class === 'chartLegendItem'
            )
            expect(popoverItems.length).toBe(yItems.length)
        })
    })
})