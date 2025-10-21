<script setup lang="ts">
import Echarts from '../Echarts/Echarts.vue';
import type { EChartsOption } from "echarts";

interface IProps {
    // 颜色
    colors?: string[],
    // 数据
    value: number,
    //仪表盘半径，可以是相对于容器高宽中较小的一项的一半的百分比，也可以是绝对的数值。
    radius?: string,
    // 标题配置
    title?: IObject,
    // 标题
    name?: string,
    //主题色
    theme?: string
}
const props = withDefaults(defineProps<IProps>(), {
    colors: () => [],
    value: 0,
    radius: '100%'
})

const option = $computed(() => {
    const options1: EChartsOption = {
        series:[
            // 中间灰色轴线
            {
                type: "gauge",
                radius: props.radius, // 位置
                center: ["50%", "70%"],
                min: 0,
                max: 100,
                startAngle: 180,
                endAngle: 0,
                axisLine: {
                    show: true,
                    lineStyle: {
                        // 轴线样式
                        width: 10, // 宽度
                        //仪表盘的轴线可以被分成不同颜色的多段。每段的结束位置和颜色可以通过一个数组来表示。
                        color: [[1, props.colors[0] || '#ccc']]
                    },
                },
                axisTick: {
                    // 刻度
                    show: false,
                },
                splitLine: {
                    // 分割线
                    show: false,
                },
                axisLabel: {
                    // 刻度标签
                    show: false,
                },
                pointer: {
                    // 仪表盘指针
                    show: false,
                },
                detail: {
                    // 仪表盘详情
                    show: false,
                },
            },
            // 数据
            {
                type: "gauge",
                radius:  props.radius, 
                center: ["50%", "70%"],
                startAngle: 180,
                endAngle: 0,
                min: 0,
                max: 100,
                axisLine: {
                    show: true,
                    lineStyle: {
                        // 轴线样式
                        width: 10, // 宽度
                        color: [[ (props.value ?? 0) / 100,props.colors[1] || '#ccc' ]],
                    },
                },
                pointer: {
                    // 仪表盘指针
                    show: false,
                },
                axisTick: {
                    // 刻度
                    show: false,
                },
                splitLine: {
                    // 分割线
                    show: false,
                },
                axisLabel: {
                    // 刻度标签
                    show: false,
                },
                detail: {
                    // 仪表盘详情
                    show: false,
                },
                data: [
                    {
                        value: props.value,
                        name: props.name,
                    }
                ],
                title :props.title
            },
        ]

    }
    return options1
});
</script>

<template>
    <div class="EaconComponents EaconComponentsGaugeChart">
        <Echarts class="EaconComponentsGaugeChartComponent" ref="chartComponent" 
            :option :theme></Echarts>
    </div>
</template>

<style lang='scss' scoped>
.EaconComponentsGaugeChart {
    height: 100%;
    width: 100%;
    display: flex;
}
</style>