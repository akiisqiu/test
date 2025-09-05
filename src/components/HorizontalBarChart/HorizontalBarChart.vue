<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import * as echarts from "echarts";
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from "echarts";

interface IProps {
    // 标题
    title?: string,
    //数据
    x: string[],
    // y轴数据
    y: string[],
    //单位
    units?:string,
    //tooltip
    tooltip?: IObject,
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
})
const horizontalBarChart = useTemplateRef<any>('HorizontalBarChartComponent')


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
            max: "dataMax",
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                show:false,
                color: "#D2D2ED",
                fontSize: 12,
                alignMaxLabel: "right",
                alignMinLabel: "left",
            },
        },
        yAxis: {
            type: 'category',
            data: props.y.length>0 ? props.y : ['-'],
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                color: "#D2D2ED",
                interval: 0,
                fontSize: 12,
            },
            inverse: true
        },
        series: [
            {
                type: "bar",
                barWidth: 6,
                showBackground: true,
                backgroundStyle: {
                    color: "rgba(255, 255, 255, 0.1)",
                    borderRadius: 3,
                },
                itemStyle: {
                    borderRadius: 3,
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        { offset: 0, color: "rgba(157, 245, 226, 1)" },
                        { offset: 0.5, color: "rgba(112, 168, 245, 1)" },
                    ]),
                },
                data: props.x.length>0 ? props.x : [0],
            },
        ],
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
    horizontalBarChart: computed(() => horizontalBarChart.value?.chart || null)
})
</script>

<template>
    <div class="EaconComponents EaconComponentsHorizontalBarChart">
        <div class="header">
            <div class="EaconComponentsHorizontalBarChartTitle">{{ props.title }}</div>
            <div class="EaconComponentsHorizontalBarChartUnits">{{ props.units }}</div>
        </div>
        <Echarts class="EaconComponentsHorizontalBarChartComponent"  id="HorizontalBarChart" ref="HorizontalBarChartComponent" :option  @clickEffective="clickEffective" @clickZr="clickZr"></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsHorizontalBarChart {
    height: 100%;
    display: flex;
    flex-direction: column;
    .header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .EaconComponentsHorizontalBarChartComponent {
        height: 1%;
        flex: 1 1 auto;
    }
}
</style>
