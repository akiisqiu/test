<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef, watch } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from "echarts";
import type { ISeriesOption } from '../Echarts/Echarts.vue';
import { getBarSeries,createBaseY } from '../Echarts/ChartConfig'
import { getYAxisMax } from  '../../utils/chart.ts'


// x、y坐标轴标签样式
export interface AxisLabel {
    interval: 'auto' | number | ((index: number, value: string) => boolean)
    // 旋转的角度
    rotate: number;
    // 刻度标签与轴线之间的距离。
    margin: number;
    // 刻度标签的内容格式器，支持字符串模板和回调函数两种形式。
    formatter: string | ((value: string, index: number, extra: unknown) => string);
    // 显示最小标签
    showMinLabel: boolean
    // 显示最大标签
    showMaxLabel: boolean
}

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
    units?: string[],
    //tooltip
    tooltip?: Record<string, unknown>,
    //是否双y轴
    doubleY?: boolean,
    //X轴标签样式
    XAxisLabel?: AxisLabel;
    //是否显示图例
    showLegend?: boolean,
    //主题色
    theme?: string
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
    colors: () => [],
    doubleY: false,
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


const barChart = useTemplateRef<any>('BarChartComponent')
const chartInstance = $computed(() => barChart.value?.chart)


const option = $computed(() => {
    //计算显示数据
    const series: EChartsOption['series'] = [];
    props.y.forEach((item, index) => {
        const result = getBarSeries(item, index, props.doubleY,props.colors)
        series.push(result)
    })

    //计算y轴数据
    let resultY: EChartsOption['yAxis']
    if (props.doubleY && props.y?.length) {
        resultY = props.y.map(item=>({
            ...createBaseY(),
            _name: item.name || '',
            alignTicks: true,
        }))
    } else {
        resultY = createBaseY()
    }
    const options1: EChartsOption = {
        legend: {
            show: false
        },
        tooltip: {
            ...props.tooltip
        },
        grid: {
            left: 0,
            top: 10,
            right: 0,
            bottom: 0,
        },
        xAxis: {
            data: props.x.length>0 ? props.x : ['-'],
            type: 'category',
            axisLabel: {
                fontSize: 12,
                lineHeight: 12,
                ...props.XAxisLabel
            },
        },
        yAxis: resultY,
        series,
    } 
    return options1
});

onMounted(async() => {
    await nextTick()
    getYAxisMax(barChart.value.chart, props.doubleY);
});

watch(
    () => [option,props.theme],
    () => {
        // 配置更新后延迟获取
        getYAxisMax(barChart.value.chart, props.doubleY);
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
    getYAxisMax(barChart.value.chart, props.doubleY);
    $emit('legendSelectChanged',params)
}
defineExpose({
    barChart: computed(() => barChart.value?.chart || null)
})

</script>

<template>
    <div class="EaconComponents EaconComponentsBarChart">
        <chartHeader :title :y="headerY" :chart="chartInstance" :colors="headerColors"></chartHeader>
        <div class="EaconComponentsBarChartUnit">
            <div v-for="item in units" class="EaconComponentsBarChartUnitItem">
                {{ item }}
            </div>
        </div>
        <Echarts class="EaconComponentsBarChartComponent" id="BarChart" ref="BarChartComponent" :option :theme
            @clickEffective="clickEffective" @clickZr="clickZr" @legendSelectChanged="legendSelectChanged" ></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsBarChart {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .EaconComponentsBarChartUnit {
        display: flex;
        justify-content: space-between;
        color: var(--ea-text2);
        font-size: .75rem;
    }

    .EaconComponentsBarChartComponent {
        height: 1%;
        flex: 1 1 auto;    }
}
</style>
<style lange="scss">

</style>
