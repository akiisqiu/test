<script setup lang="ts">
import * as echarts from "echarts";
import Echarts from '../Echarts/Echarts.vue';

import remToPx from '../../utils/rem2px'
import type { EChartsOption } from "echarts";

interface IProps {
    title?: string,
    x: string[],
    y: string[],
    units?:string,
    tooltip?: IObject,
    seriesOption?: Record<string, any>,
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
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
            left: remToPx(3),
            top: remToPx(12),
            right: remToPx(0),
            bottom: remToPx(0),
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
                fontSize: remToPx(12),
                alignMaxLabel: "right",
                alignMinLabel: "left",
            },
        },
        yAxis: {
            type: 'category',
            data: props.x,
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
            axisLabel: {
                color: "#D2D2ED",
                interval: 0,
                fontSize: remToPx(12),
            },
            inverse: true
        },
        series: [
            {
                type: "bar",
                barWidth: remToPx(6),
                showBackground: true,
                backgroundStyle: {
                    color: "rgba(255, 255, 255, 0.1)",
                    borderRadius: remToPx(3),
                },
                itemStyle: {
                    borderRadius: remToPx(3),
                    color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                        { offset: 0, color: "rgba(157, 245, 226, 1)" },
                        { offset: 0.5, color: "rgba(112, 168, 245, 1)" },
                    ]),
                },
                data: props.y,
                ...props.seriesOption ?? {}
            },
        ],
    } as EChartsOption
});


</script>

<template>
    <div class="EaconComponents EaconComponentsHorizontalBarChart">
        <div class="header">
            <div class="EaconComponentsHorizontalBarChartTitle">{{ props.title }}</div>
            <div class="EaconComponentsHorizontalBarChartUnits">{{ props.units }}</div>
        </div>
        <Echarts class="EaconComponentsHorizontalBarChartComponent" ref="chartComponent" :option></Echarts>
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
