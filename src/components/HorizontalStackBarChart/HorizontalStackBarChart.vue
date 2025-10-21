<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from "echarts";
import type { IYOption } from '../ChartHeader/ChartHeader.vue'
import type { ISeriesOption } from '../Echarts/Echarts.vue';

interface IProps {
    // 标题
    title?: string,
    // 颜色
    colors?: string[]
    // Y轴数据
    y: string[],
    //series 数据 
    x: ISeriesOption[],
    //单位
    units?:string,
    //tooltip
    tooltip?: IObject,
    //是否百分比
    percentage?: boolean,
    //X轴标签样式
    xAxisLabel?: boolean;
    //主题色
    theme?: string
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
    //计算显示数据
    let series: EChartsOption['series'] = [];
    series = stackYData.map((item,idx)=>({
        type: 'bar',
        stack: 'total',
        name:item.name,
        data: item.data.length>0 ? item.data : [0],
        color: props.colors[idx % props.colors.length],
        barWidth:item.barWidth !== undefined && item.barWidth !== null
            ? item.barWidth
            : 12,
        itemStyle: {
            ...item.itemStyle,
            borderWidth: 2,
            borderRadius: item.itemStyle?.borderRadius !== undefined
            ? item.itemStyle?.borderRadius   : 12                              
        },
        tooltip: item.tooltip,
    }))
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
            nameLocation:'start',
            max: props.percentage ? 100 : undefined,
            splitLine: {
                show: false,
            },
            axisLabel: {
                show:props.xAxisLabel,
                margin: 0,
                fontSize: 12,
                lineHeight: 12,
                alignMaxLabel: "right",
                alignMinLabel: "left",
            },
        },
        yAxis: {
            type: "category",
            data: props.y.length>0 ? props.y : ['-'],
            axisLabel: {
                margin: 20,
                fontSize: 12,
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
        series
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
    horizontalStackBarChart: computed(() => horizontalStackBarChart.value?.chart || null)
})

</script>

<template>
    <div class="EaconComponents EaconComponentsHorizontalStackBarChart">
        <chartHeader :title :y="x" :chart="chartInstance" :colors></chartHeader>
        <Echarts class="EaconComponentsHorizontalStackBarChartComponent" 
            id="HorizontalStackBarChart" ref="HorizontalStackBarChartComponent" 
            :option  @clickEffective="clickEffective" @clickZr="clickZr" :theme>
        </Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsHorizontalStackBarChart {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .EaconComponentsHorizontalStackBarChartComponent {
        height: 1%;
        flex: 1 1 auto;
    }
}
</style>
