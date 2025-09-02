<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from "echarts";
import type { IYOption } from '../ChartHeader/ChartHeader.vue'

export interface IExtendedYOption extends IYOption {
    barWidth?: number;
    itemStyle?: IObject<any>;
    tooltip?: IObject<any>;
}

interface IProps {
    title?: string,
    colors?: string[]
    x: string[],
    y: IExtendedYOption[],
    units?: string[],
    tooltip?: IObject,
    percentage?: boolean,
    anotherData?: IObject,
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
    colors: () => [],
})

const chart = useTemplateRef<any>('chartComponent')
const chartInstance = $computed(() => chart.value?.chart)

//堆叠数据计算
const stackYData = $computed(() => {
    //计算总和
    const totals = props.y.length > 0
        ? props.y[0].value.map((_, index) => {
            // 累加
            return props.y.reduce((sum, yItem) => {
                return sum + (yItem.value[index] || 0);
            }, 0);
        })
        : [];
    const stackData = props.y.map((item, idx) => {
        const itemStackData = item.value.map((value, vIdx) => {
            // 百分比
            if (props.percentage) {
                const total = totals[vIdx]

                const percent = total > 0 ? (value / total) * 100 : 0
                return percent.toFixed(2)
            } else {//正常堆叠
                return value
            }
        })
        return {
            ...item,
            data: itemStackData
        }
    })
    return stackData
})
const option = $computed(() => {
    return {
        legend: {
            show: false
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "shadow",
                shadowStyle: {
                    color: "rgba(255,255,255,0.05)",
                }
            },
            className: "ChartsTooltip",
            appendToBody: true,
            confine: true,
            backgroundColor: "rgba(0,0,0, .6)",
            borderColor: "rgba(0,0,0)",
            textStyle: {
                color: "#fff",
            },
            ...props.tooltip
        },
        grid: {
            left: 3,
            top: 12,
            right: 0,
            bottom: 0,
            containLabel: true,
        },
        xAxis: {
            data: props.x,
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                color: "#D2D2ED",
                fontSize: 12,
                lineHeight: 12,
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: "#D2D2ED",
                fontSize: 12,
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.04)'
                }
            },
            axisLine: {
            },
            axisTick: {
                show: false
            },
            max: props.percentage ? 100 : undefined,
        },
        series: stackYData.map((item, idx) => ({
            type: 'bar',
            stack: 'total',
            name: item.label,
            data: item.data,
            color: props.colors[idx],
            barWidth: item.barWidth !== undefined ? item.barWidth : 12,
            itemStyle: {
                ...item.itemStyle,
                borderWidth: 2,
                borderRadius: item.itemStyle?.borderRadius !== undefined
                    ? item.itemStyle?.borderRadius : 12
            },
            tooltip: item.tooltip,
        })),
    } as EChartsOption
});
const $emit = defineEmits(['clickEffective', 'clickZr'])
// 点击事件
const clickEffective = (params: any) => {
    $emit('clickEffective', params)
}
const clickZr = (params: any) => {
    $emit('clickZr', params)
}

defineExpose({
    chart: computed(() => chart.value?.chart || null)
})
</script>

<template>
    <div class="EaconComponents EaconComponentsStackBarChart">
        <chartHeader :title :y :chart="chartInstance" :colors></chartHeader>
        <div class="EaconComponentsStackBarChartUnit">
            <div v-for="item in units" class="EaconComponentsStackBarChartUnitItem">
                {{ item }}
            </div>
        </div>
        <Echarts class="EaconComponentsStackBarChartComponent" id="StackBarChart" ref="chartComponent" :option
            @clickEffective="clickEffective" @clickZr="clickZr"></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsStackBarChart {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .EaconComponentsStackBarChartUnit {
        display: flex;
        justify-content: space-between;
        color: #D2D2ED;
        font-size: .75rem;
    }

    .EaconComponentsStackBarChartComponent {
        height: 1%;
        flex: 1 1 auto;
    }
}
</style>