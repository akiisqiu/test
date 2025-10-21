<template>
    <div ref="chartHeaderDom" class="EaconComponents EaconComponentsChartHeader chartHeader">
        <div class="chartTitle">
            {{ title }}
        </div>
        <ElPopover v-if="y?.length" placement="top-end" :width popper-class="chartHeaderDomPopper" :disabled="!showMore">
            <template #reference>
                <div class="chartLegendContainer">
                    <div ref="chartLegendDom" class="chartLegend chartLegendHidden" :class="{ showMore }">
                        <div class="chartLegendItem" v-for="(item, idx) in y" :key="idx" :class="{ hidden: hidden.has(item.name), opacity: idx >= showY }" @click="handleChangeLegend(item)">
                            <div v-if="!item.itemType || item.itemType === 'bar'" class="chartLegendItemMark" :class="item.itemType" :style="{ background: colors[idx], borderColor: colors[idx] }"></div>
                            <div v-else-if="item.itemType === 'line'" class="chartLegendItemMark" :class="item.itemType" :style="{ color: colors[idx] }">
                                <Icon type="icon-zhexiantuli"></Icon>
                            </div>
                            {{ item.name }}
                        </div>
                    </div>
                    <Icon v-show="showMore" class="chartLegendMore" type="icon-more"></Icon>
                </div>
            </template>
            <div class="chartLegend" :style="{ 'grid-template-columns': `repeat(${columns}, 1fr)` }">
                <div class="chartLegendItem" v-for="(item, idx) in y" :key="idx" :class="{ hidden: hidden.has(item.name) }" @click="handleChangeLegend(item)">
                    <div v-if="!item.itemType || item.itemType === 'bar'" class="chartLegendItemMark" :class="item.itemType" :style="{ background: colors[idx], borderColor: colors[idx] }"></div>
                    <div v-else-if="item.itemType === 'line'" class="chartLegendItemMark" :class="item.itemType" :style="{ color: colors[idx] }">
                        <Icon type="icon-zhexiantuli"></Icon>
                    </div>
                    <div class="chartLegendItemLabel">{{ item.name }}</div>
                </div>
            </div>
        </ElPopover>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef, nextTick, onBeforeUnmount, watch } from 'vue'
import { ElPopover } from "element-plus";
import type { ECharts } from "echarts";
import Icon from "../Icon/Icon.vue"
import { getTextWidth } from "../../utils/dom";

export interface IYOption {
    itemType?: 'bar' | 'line'
    name: string,
    data: number[]
}
interface IProps {
    title?: string,
    y: IYOption[],
    colors: string[],
    chart: ECharts | null
}

const props = defineProps<IProps>();
const emit = defineEmits([]);

const chartHeader = useTemplateRef("chartHeaderDom")
const chartLegend = useTemplateRef("chartLegendDom")
let width = $ref<number | string>(0)
let showMore = $ref(false)
let showY = $ref(props.y.length)
let columns = $ref(1)

const hidden = $ref(new Set())
const handleChangeLegend = (item: IYOption) => {
    const key = item.name
    hidden.has(key) ? hidden.delete(key) : hidden.add(key)
    props.chart?.dispatchAction({
        type: 'legendToggleSelect',
        name: key
    });
}
const computedTooltip = () => {
    width = Math.ceil(chartHeader.value?.getBoundingClientRect().width ?? 0 * 0.65)
    const htmlElement = document.querySelector('html');
    const fz = htmlElement ? parseFloat(htmlElement.style.fontSize || '16') : 16;
    const textWidths = props.y.map(item => getTextWidth(item.name, '1rem'))
    const maxWidth = Math.ceil(Math.max(...textWidths)) + 1 + 1.06 * fz
    const gap = .4 * fz
    const itemWidthWithGap = maxWidth + gap
    const enough = (width % itemWidthWithGap) > maxWidth
    columns = ~~(width / itemWidthWithGap) + Number(enough)
}

const computedContent = () => {
    const htmlElement = document.querySelector('html');
    const fz = htmlElement ? parseFloat(htmlElement.style.fontSize || '16') : 16;

    const dom = chartLegend?.value 
    if (!dom) return
    const domWidth = ~~(dom.offsetWidth)
    const children = [...(dom.children ?? [])] as HTMLDivElement[]
    const childrenWidths = children.map((i) => i.offsetWidth)
    const allChildrenWidth = childrenWidths.reduce((l, i) => l + i, 0)

    showMore = allChildrenWidth > domWidth
    showY = 1000

    if (!showMore) return

    nextTick(() => {
        const dom = chartLegend?.value
        if (!dom) return
        const domWidth = ~~(dom.offsetWidth)
        let n = 0
        showY = childrenWidths.findIndex((item, idx) => {
            n += item
            return  n  - fz * .8 > domWidth
        })
    })

}
const resize = (again: boolean = true) => {
    nextTick(() => {
        if (!chartLegend?.value) {
            // 产量分析使用场景异常，临时递归调用解决
            setTimeout(resize, 200)
            return
        }
        computedTooltip()
        computedContent()
        // width = chartHeader.value?.getBoundingClientRect().width || 'auto'
        // if (!chartLegend?.value) {
        //     // 产量分析使用场景异常，临时递归调用解决
        //     setTimeout(resize, 200)
        //     return

        // }
        // const dom = chartLegend?.value
        // const domWidth = chartLegend.value.scrollWidth
        // let childrenWidth = 0
        // const arr = [...(dom.children ?? [])] as HTMLDivElement[]
        // arr.forEach((item, idx) => {
        //     childrenWidth += item.offsetWidth ?? 0
        //     if (childrenWidth < domWidth) {
        //         showY = idx
        //     }
        // })
        // showMore = domWidth < childrenWidth

        // if (again && !showMore) {
        //     resize(false)
        // }
    })
}
resize()

const bindResize = () => resize()
watch(() => props.y, bindResize)
window.addEventListener('resize', bindResize)
onBeforeUnmount(() => window.removeEventListener('resize', bindResize))


</script>

<style lang="scss">
.el-popper.chartHeaderDomPopper {
    backdrop-filter: blur(1.3rem);
    background: linear-gradient(151deg, #000000 0%, rgba(0, 0, 0, 0.58) 100%) !important;
    border: 0.06rem solid rgba(0, 0, 0, 0.29) !important;
    padding: 1rem;
    border-radius: .5rem;
    box-sizing: content-box;
    .chartLegend {
        display: grid;
    }
    .el-popper__arrow{
        display: none;
    }
}
</style>

<style lang="scss" scoped>
.EaconComponentsChartHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    .chartTitle {
        flex: 0 0 auto;
        font-size: 1.125rem;
    }

    .chartLegendHidden {
        overflow: hidden;
        flex-wrap: nowrap;
        justify-content: flex-end;

        &::-webkit-scrollbar {
            display: none;
        }

        &.showMore {
            justify-content: flex-start;
        }
    }

    .chartLegendMore {
        font-size: 1.25rem;
        flex: 0 0 auto;
        cursor: pointer;

        &:hover {
            color: var(--ea-primary);
        }

        &:focus {
            outline: none !important;
        }
    }
}

.chartLegendContainer {
    width: 1px;
    flex: 1 1 auto;
    display: flex;
    gap: 0.8rem;
}

.chartLegend {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    z-index: 1;
    flex: 1 1 auto;
    gap: .8rem 0;

    .chartLegendItem {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        cursor: pointer;
        user-select: none;
        color: var(--ea-text2);
        font-size: 0.75rem;
        flex: 0 0 auto;
        padding-right: .8rem;

        &:last-child {
            padding: 0;
        }

        &.hidden {
            .chartLegendItemMark {
                background: none !important;

                &.line {
                    opacity: .3;
                }
            }
        }

        &.opacity {
            visibility: hidden;
        }

        .chartLegendItemMark {
            width: 0.66rem;
            height: 0.66rem;
            border-radius: .13rem;
            border: .1rem solid transparent;
            transition: .2s;
            flex: 0 0 auto;

            &.line {
                border: none;
                margin-right: 2px;

                .iconfont {
                    font-size: 1rem;
                    margin-top: -0.1rem;
                }
            }
        }

        .chartLegendItemLabel {
            line-height: .66rem;
            margin-top: .1rem;
            font-size: 1rem;
            word-break: keep-all;
        }
    }
}
</style>
