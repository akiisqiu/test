<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef, watch } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from "echarts";
import type { ISeriesOption } from '../Echarts/Echarts.vue';
import { getYAxisMax } from  '../../utils/chart.ts'

interface IProps {
    // 标题
    title?: string,
    // 颜色
    colors?: string[]
    // x轴数据
    x: string[],
    //series 数据 
    y: ISeriesOption[],
    //单位
    units?:string[],
    //tooltip
    tooltip?: IObject,
    //是否百分比
    percentage?: boolean,
    //X轴标签样式
    XAxisLabel?: IObject<any>;
    //其他数据传入
    anotherData?: IObject;
    //是否显示图例
    showLegend?: boolean;
    //主题色
    theme?: string;
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
    colors: () => [],
    showLegend:true
})

//header配置
const headerY = $computed(() => { 
    if (props.showLegend) {
        return props.y.map(item =>({
            ...item,
        }))
    } else return []
})
const headerColors = $computed(() => {
    if (!props.colors || !props.y) return [];
    const colors: string[] = [];
    const len = props.colors.length;
    props.y.forEach((_, i) => {
        colors.push(props.colors[i % len]); 
    });
    return colors;
});

const stackBarChart = useTemplateRef<any>('StackBarChartComponent')
const chartInstance = $computed(() => stackBarChart.value?.chart)

//堆叠数据计算
const stackYData = $computed(() => {
    //计算总和
    const totals = props.y.length > 0
        ? props.y[0].data.map((_, index) => {
            // 累加
            return props.y.reduce((sum, yItem) => {
                return sum + (yItem.data[index] || 0);
            }, 0);
        })
        : [];
    const stackData = props.y.map((item, idx) => {
        const itemStackData = item.data.map((value, vIdx) => {
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
const option = $computed<EChartsOption>(() => {
    let series: EChartsOption['series'] = [];
    series = stackYData.map((item, idx) => ({
        type: 'bar',
        stack: 'total',
        name: item.name,
        data: item.data.length>0 ? item.data : [0],
        color: props.colors[idx % props.colors.length],
        barWidth: item.barWidth === null ? 'undefined' : (item.barWidth !== undefined ? item.barWidth : 12),
        itemStyle: {
            ...item.itemStyle,
            borderWidth: 2,
            borderRadius: item.itemStyle?.borderRadius !== undefined
                ? item.itemStyle?.borderRadius : 12
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
            type: "category",
            data: props.x.length>0 ? props.x : ['-'],
            axisLabel: {
                fontSize: 12,
                lineHeight: 12,
                ...props.XAxisLabel
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 12,
            },
            max: props.percentage ? 100 : undefined,
        },
        series
    }
    return options1
});


onMounted(async() => {
    await nextTick()
    getYAxisMax(stackBarChart.value.chart, props.doubleY);
});

watch(
    () => [option,props.theme],
    () => {
        // 配置更新后延迟获取
        getYAxisMax(stackBarChart.value.chart, props.doubleY);
    }
);

const $emit = defineEmits(['clickEffective', 'clickZr','legendSelectChanged'])
// 点击事件
const clickEffective = (params: any) => {
    $emit('clickEffective', params)
}
const clickZr = (params: any) => {
    $emit('clickZr', params)
}
//图例勾选
const legendSelectChanged = (params: any)=>{
    getYAxisMax(stackBarChart.value.chart, props.doubleY);
    $emit('legendSelectChanged',params)
}
defineExpose({
    stackBarChart: computed(() => stackBarChart.value?.chart || null)
})
</script>

<template>
    <div class="EaconComponents EaconComponentsStackBarChart">
        <chartHeader :title :y="headerY" :chart="chartInstance" :colors="headerColors"></chartHeader>
        <div class="EaconComponentsStackBarChartUnit">
            <div v-for="item in units" class="EaconComponentsStackBarChartUnitItem">
                {{ item }}
            </div>
        </div>
        <Echarts class="EaconComponentsStackBarChartComponent" id="StackBarChart" ref="StackBarChartComponent" :option
            @clickEffective="clickEffective" @clickZr="clickZr" @legendSelectChanged="legendSelectChanged" :theme></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsStackBarChart {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .EaconComponentsStackBarChartUnit {
        display: flex;
        justify-content: space-between;
        color: var(--ea-text2);
        font-size: .75rem;
    }

    .EaconComponentsStackBarChartComponent {
        height: 1%;
        flex: 1 1 auto;
    }
}
</style>