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
    //主题色
    theme?: string
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
})
const horizontalBarChart = useTemplateRef<any>('HorizontalBarChartComponent')


const option = $computed(() => {
    const options1: EChartsOption = {
        legend: {
            show: false
        },
        tooltip: {
            ...props.tooltip
        },
        grid: {
            left: 3,
            top: 12,
            right: 0,
            bottom: 0,
        },
        xAxis: {
            type: "value",
            max: "dataMax",
            splitLine: {
                show: false,
            },
            axisLabel: {
                show:false,
            },
        },
        yAxis: {
            type: 'category',
            data: props.y.length>0 ? props.y : ['-'],
            axisLabel: {
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
    }
    return options1
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
        <Echarts class="EaconComponentsHorizontalBarChartComponent"  id="HorizontalBarChart" ref="HorizontalBarChartComponent" :option  @clickEffective="clickEffective" 
            @clickZr="clickZr" :theme></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsHorizontalBarChart {
    height: 100%;
    width: 100%;
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
