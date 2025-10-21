<script setup lang="ts">
import Echarts from '../Echarts/Echarts.vue';
import type { EChartsOption } from "echarts";

interface IProps {
    // 饼图数据
    data: any[];
    // 颜色
    colors?: string[];
    // 饼图配置项 饼图的半径
    radius?:string[];
    // 饼图配置项 饼图扇区之间的间隔角度
    padAngle?: number;
    // 饼图配置项 饼图扇区之间的间隔半径
    borderRadius?: number,
    // 饼图配置项 饼图的中心点
    center?: string[];
    // 饼图配置项 饼图起始角度
    startAngle?: number;
    // 饼图配置项 饼图结束角度
    endAngle?: number;
    //主题色
    theme?: string;
}
const props = withDefaults(defineProps<IProps>(), {
    data: () => [],
    radius: () => ['0%', '50%'],
    center: () => ['50%', '50%'],
    padAngle:0,
    borderRadius: 0,
    startAngle: 0,
    endAngle: 360
})

const option = $computed(() => {
    const options1: EChartsOption = {
        tooltip: {
            trigger: 'item',
        },
        series: [
            {
                type: 'pie',
                avoidLabelOverlap: false,
                // 饼图配置项 饼图的半径
                radius: props.radius,
                //饼图扇区之间的间隔角度
                padAngle: props.padAngle,
                //饼图的中心点
                center: props.center,
                //饼图起始角度
                startAngle: props.startAngle,
                //饼图结束角度
                endAngle: props.endAngle,
                itemStyle: {
                    borderRadius: props.borderRadius
                },
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                },
                data: props.data.map((item,idx) => { 
                    return {
                        value: item.value,
                        name: item.name,
                        itemStyle: {
                            color: props.colors && props.colors[idx % props.colors.length],
                        }
                    }
                })
            }
        ]
    }
    return options1;
})
</script>

<template>
    <div class="EaconComponents EaconComponentsPieChart">
        <Echarts class="EaconComponentsPieChartComponent" ref="chartComponent" :option :theme></Echarts>
    </div>
</template>

<style lang='scss' scoped>
.EaconComponentsPieChart {
    height: 100%;
    width: 100%;
    display: flex;
}
</style>