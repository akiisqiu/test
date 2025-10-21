<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef, watch } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from 'echarts';
import type { ISeriesOption } from '../Echarts/Echarts.vue';
import { getBarSeries, getLineSeries,getStackSeries,createBaseY } from '../Echarts/ChartConfig';
import { getYAxisMax } from  '../../utils/chart.ts'

export interface IProps {
    // 标题
    title?: string,
    // 颜色
    colors?: string[],
    // x轴数据
    x: string[],
    //series 数据 
    y: ISeriesOption[],
    //单位
    units?: string[],
    //tooltip
    tooltip?: IObject,
    //是否双y轴
    doubleY?: boolean,
    //X轴标签样式
    XAxisLabel?: IObject<any>;
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
const headerY = $computed(() => { 
    if (props.showLegend) {
        return props.y.map(item =>({
            ...item,
            itemType: item.type === 'stackBar' ? 'bar' : item.type
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

const mixLineBarChart = useTemplateRef<any>('MixLineBarChartComponent')
const chartInstance = $computed(() => mixLineBarChart.value?.chart)

//计算series
const getSeries = (props: IProps) =>{
    const { y } = props;
    const normalSeries: EChartsOption['series'] = [];
    //堆叠图
    const stackSeries: EChartsOption['series'] = [];
    const stackGroups = new Map();

    y.forEach((item, index) => {
        const itemType = item.type || 'bar'
        if (itemType === 'bar') {
            const result = getBarSeries(item, index, props.doubleY,props.colors)
            normalSeries.push(result)
        }
        if (itemType === 'line') {
            const result = getLineSeries(item, index, props.doubleY,props.colors)
            normalSeries.push(result)
        }
        if (itemType === 'stackBar') {
            const stackName = item.stack || 'total';
            if (!stackGroups.has(stackName)) {
                stackGroups.set(stackName, []);
            }
            stackGroups.get(stackName)?.push({
                ...item,
                index
            });
        }
    })

    // 计算堆叠图
    stackGroups.forEach(i => {
        const result = getStackSeries(i, props.doubleY,props.colors)
        if (Array.isArray(result)) {
            stackSeries.push(...result);
        }
    });
    return [...normalSeries, ...stackSeries]
}

const option = $computed(() => { 
    //计算y轴数据
    const resultY = (props.doubleY && props.y?.length)
        ? props.y.map(item => ({
            ...createBaseY(),
            _name: item.name || '',
            alignTicks: true,
        })) : createBaseY()

    //计算series stack类特殊计算
    let series: EChartsOption['series'] = [];
    series = getSeries(props)
    
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
        yAxis: resultY,
        series
    }
    return options1
})



onMounted(async() => {
    await nextTick()
    getYAxisMax(mixLineBarChart.value.chart,props.doubleY);
});

watch(
    () => [option,props.theme],
    () => {
        // 配置更新后延迟获取
        getYAxisMax(mixLineBarChart.value.chart,props.doubleY);
    }
);


const $emit = defineEmits(['clickEffective', 'clickZr','legendSelectChanged'],)
// 点击事件
const clickEffective = (params: any) => {
    $emit('clickEffective', params)
}
const clickZr = (params: any) => {
    $emit('clickZr', params)
}
//图例勾选
const legendSelectChanged = (params: any)=>{
    getYAxisMax(mixLineBarChart.value.chart,props.doubleY);
    $emit('legendSelectChanged',params)
}
defineExpose({
    mixLineBarChart: computed(() => mixLineBarChart.value?.chart || null)
})

</script>

<template>
    <div class="EaconComponents EaconComponentsMixLineBarChart">
        <chartHeader :title :y="headerY" :chart="chartInstance" :colors="headerColors"></chartHeader>
        <div class="EaconComponentsMixLineBarChartUnit">
            <div v-for="item in units" class="EaconComponentsBarChartUnitItem">
                {{ item }}
            </div>
        </div>
        <Echarts class="EaconComponentsMixLineBarChartComponent" id="MixLineBarChart" ref="MixLineBarChartComponent" :option
            @clickEffective="clickEffective" @clickZr="clickZr" 
            @legendSelectChanged="legendSelectChanged"  :theme></Echarts>
    </div>
</template>

<style lang='scss' scoped>
.EaconComponentsMixLineBarChart {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .EaconComponentsMixLineBarChartUnit {
        display: flex;
        justify-content: space-between;
        color: var(--ea-text2);
        font-size: .75rem;
    }

    .EaconComponentsMixLineBarChartComponent {
        height: 1%;
        flex: 1 1 auto;    }
}
</style>