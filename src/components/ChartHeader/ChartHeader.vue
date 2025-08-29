<template>
    <div ref="chartHeaderDom" class="EaconComponents EaconComponentsChartHeader">
        <div class="chartTitle">
            {{ title }}
        </div>
        <ElPopover v-if="y?.length" placement="top-end" :width popper-class="chartHeaderDomPopper" :disabled="!showMore">
            <template #reference>
                <div class="chartLegendContainer">
                    <div ref="chartLegendDom" class="chartLegend chartLegendHidden" :class="{ showMore }">
                        <div class="chartLegendItem" v-for="(item, idx) in y" :key="idx" :class="{ hidden: hidden.has(item.label), opacity: idx > showY }" @click="handleChangeLegend(item)">
                            <div class="chartLegendItemMark" :class="item.itemType" :style="{ background: colors[idx], borderColor: colors[idx] }"></div>
                            {{ item.label }}
                        </div>
                    </div>
                    <EaIcon v-show="showMore" class="chartLegendMore" type="icon-more"></EaIcon>
                </div>
            </template>
            <div class="chartLegend">
                <div class="chartLegendItem" v-for="(item, idx) in y" :key="idx" :class="{ hidden: hidden.has(item.label) }" @click="handleChangeLegend(item)">
                    <div class="chartLegendItemMark" :class="item.itemType" :style="{ background: colors[idx], borderColor: colors[idx] }"></div>
                    <div class="chartLegendItemLabel">{{ item.label }}</div>
                </div>
            </div>
        </ElPopover>
    </div>
</template>

<script setup lang="ts">
import { useTemplateRef, nextTick, onBeforeUnmount, watch } from 'vue'
import { ElPopover } from "element-plus";
import type { ECharts } from "echarts";

export interface IYOption {
    itemType?: 'bar' | 'line'
    label: string,
    value: number[]
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

const hidden = $ref(new Set())
const handleChangeLegend = (item: IYOption) => {
    const key = item.label
    hidden.has(key) ? hidden.delete(key) : hidden.add(key)
    props.chart?.dispatchAction({
        type: 'legendToggleSelect',
        name: key
    });
}

const resize = (again: boolean = true) => {
    nextTick(() => {
        width = chartHeader.value?.getBoundingClientRect().width || 'auto'
        if (!chartLegend?.value) {
            // 产量分析使用场景异常，临时递归调用解决
            setTimeout(resize, 200)
            return

        }
        const dom = chartLegend?.value
        const domWidth = chartLegend.value.scrollWidth
        let childrenWidth = 0
        const arr = [...(dom.children ?? [])] as HTMLDivElement[]
        arr.forEach((item, idx) => {
            childrenWidth += item.offsetWidth ?? 0
            if (childrenWidth < domWidth) {
                showY = idx
            }
        })
        showMore = domWidth < childrenWidth

        if (again && !showMore) {
            resize(false)
        }
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
    .el-popper__arrow{
        display: none;
    }
}
</style>

<style lang="scss" scoped>
.EaconComponentsChartHeader {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    .chartTitle {
        flex: 0 0 auto;
        font-size: 1rem;
    }

    .chartLegendHidden {
        overflow: scroll;
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
        color: #D2D2ED;
        font-size: 0.75rem;
        flex: 0 0 auto;
        padding-right: .8rem;

        &.hidden {
            .chartLegendItemMark {
                background: none !important;
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

            &.line {
                border-radius: 50% !important;
            }
        }

        .chartLegendItemLabel {
            line-height: .66rem;
            margin-top: .1rem;
            font-size: 1rem;
        }
    }
}
</style>
