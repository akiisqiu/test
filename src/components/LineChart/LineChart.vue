<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from "echarts";
import type { IYOption } from '../ChartHeader/ChartHeader.vue'

export interface IExtendedYOption extends IYOption {
    lineStyle?:  IObject<any>;
    areaStyle?:  IObject<any>;
}

interface IProps {
    // 标题
    title?: string,
    // 颜色
    colors?: string[]
    // x轴数据
    x: string[],
    //series 数据 
    y: IExtendedYOption[],
    //单位
    units?:string[],
    //tooltip
    tooltip?: IObject,
    //是否双y轴
    doubleY?: boolean,
    //X轴标签样式
    XAxisLabel?:IObject<any>,
    //是否有间隔
    boundaryGap?: boolean
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
    colors: () => [],
    doubleY: false,
    boundaryGap:true
})
const headerY = $computed(() => { 
    return props.y.map(item =>({
        ...item,
        itemType: 'line' as const
    }))
})

const chart = useTemplateRef<any>('chartComponent')
const chartInstance = $computed(() => chart.value?.chart)

const option = $computed(() => {
    //基础y轴
    const baseY = {
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
        }
    }
    //计算y轴数据
    const resultY =  (props.doubleY && props.y?.length)
        ? props.y.map(item=>({
            ...baseY,
            _name: item.label || '',
        })):baseY

    //计算显示数据
    const series = props.y?.map((item, idx) => {
        return {
            type: "line",
            smooth: true,
            symbol:'none',
            name: item.label,
            data: item.value,
            color: props.colors[idx],
            yAxisIndex: props.doubleY ? idx : undefined,
            barMinHeight: 4,
            lineStyle: {
                width: 3,
                ...item.lineStyle,
            },
            areaStyle: item.areaStyle,
            ...item
        }
    })
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
            type: 'category',
            boundaryGap: props.boundaryGap,
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
        yAxis: resultY,
        series,
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
    <div class="EaconComponents EaconComponentsLineChart">
        <chartHeader :title :y="headerY" :chart="chartInstance" :colors></chartHeader>
        <div class="EaconComponentsLineChartUnit">
            <div v-for="item in units" class="EaconComponentsLineChartUnitItem">
                {{item}}
            </div>
        </div>
        <Echarts class="EaconComponentsLineChartComponent" id="LineChart" ref="chartComponent" :option @clickEffective="clickEffective" @clickZr="clickZr" :bound="boundaryGap"></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsLineChart {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .EaconComponentsLineChartUnit{
        display: flex;
        justify-content: space-between;
        color: #D2D2ED;
        font-size: 1rem;
    }
    .EaconComponentsLineChartComponent {
        height: 1%;
        flex: 1 1 auto;
    }
}
</style>
