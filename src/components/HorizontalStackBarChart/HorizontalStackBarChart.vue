<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from "echarts";
import type { IYOption } from '../ChartHeader/ChartHeader.vue'
import type { IExtendedYOption } from '../Echarts/Echarts.vue';

interface IProps {
    // 标题
    title?: string,
    // 颜色
    colors?: string[]
    // Y轴数据
    y: string[],
    //series 数据 
    x: IExtendedYOption[],
    //单位
    units?:string[],
    //tooltip
    tooltip?: IObject,
    //是否百分比
    percentage?: boolean,
    //X轴标签样式
    xAxisLabel?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
    colors: () => [],
})

const horizontalStackBarChart = useTemplateRef<any>('HorizontalStackBarChartComponent')
const chartInstance = $computed(() => horizontalStackBarChart.value?.chart)


//堆叠数据计算
const stackYData = $computed(() => {
    //计算总和
    const totals =  props.x.length > 0 
        ? props.x[0].data.map((_, index) => {
            // 累加
            return props.x.reduce((sum, yItem) => {
                return sum + (yItem.data[index] || 0);
            }, 0);
        })
        : [];
    const stackData = props.x.map((item,idx) => {
        const itemStackData = item.data.map((value,vIdx) => { 
            // 百分比
            if(props.percentage){
                const total = totals[vIdx]

                const percent = total > 0 ? (value / total) * 100 : 0
                return percent.toFixed(2)
            }else{//正常堆叠
                return value
            }
        })
        return {
            ...item,
            data:itemStackData
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
            nameLocation:'start',
            max: props.percentage ? 100 : undefined,
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                show:props.xAxisLabel,
                margin: 0,
                color: "#D2D2ED",
                fontSize: 12,
                lineHeight: 12,
                alignMaxLabel: "right",
                alignMinLabel: "left",
            },
            axisTick: {
                show: false
            },
        },
        yAxis: {
            type: "category",
            data: props.y.length>0 ? props.y : ['-'],
            axisLabel: {
                color: "#D2D2ED",
                margin: 20,
                fontSize: 12,
            },
            axisLine: {
                show: false,
            },
            axisTick: {
                show: false,
            },
        },
        graphic: {
            elements: [
                {
                    type: 'text',
                    bottom:0,
                    z: 100,
                    style: {
                        text:props.units,
                        fontSize: 12,
                        fill: "#D2D2ED",
                    }
                }
            ]
        },
        series: stackYData.map((item,idx)=>({
            type: 'bar',
            stack: 'total',
            name:item.name,
            data: item.data.length>0 ? item.data : [0],
            color: props.colors[idx % props.colors.length],
            barWidth: item.barWidth !== undefined ? item.barWidth : 12,
            itemStyle: {
                ...item.itemStyle,
                borderWidth: 2,
                borderRadius: item.itemStyle?.borderRadius !== undefined
                ? item.itemStyle?.borderRadius   : 12                              
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
    horizontalStackBarChart: computed(() => horizontalStackBarChart.value?.chart || null)
})

</script>

<template>
    <div class="EaconComponents EaconComponentsHorizontalStackBarChart">
        <chartHeader :title :y="x" :chart="chartInstance" :colors></chartHeader>
        <Echarts class="EaconComponentsHorizontalStackBarChartComponent" id="HorizontalStackBarChart" ref="HorizontalStackBarChartComponent" :option  @clickEffective="clickEffective" @clickZr="clickZr"></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsHorizontalStackBarChart {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .EaconComponentsHorizontalStackBarChartComponent {
        height: 1%;
        flex: 1 1 auto;
    }
}
</style>
