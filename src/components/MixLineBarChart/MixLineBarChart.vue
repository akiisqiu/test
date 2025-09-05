<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';
import { getBarSeries, getLineSeries,getStackSeries,createBaseY } from '../Echarts/ChartConfig';

import type { EChartsOption } from 'echarts';
import type { IYOption } from '../ChartHeader/ChartHeader.vue'; 

export interface IExtendedYOption extends IYOption {
    type?: 'line' | 'bar' | 'stackBar';
    barWidth?: number | null;
    barMinWidth?: number;
    itemStyle?: IObject<any>;
    tooltip?: IObject<any>;
    // 折线样式
    lineStyle?:  IObject<any>;
    areaStyle?:  IObject<any>;
    // 0: 左侧y轴 1: 右侧y轴 不传第一条数据默认左侧轴，其余数据右侧y轴
    yAxisIndex?: number;
    //堆叠图配置 根据stack 名称相同的堆叠在一起
    stack?: string;
    //index 给堆叠图做索引使用 不需传输 堆叠图自行计算
    index?: number;
}

export interface IProps {
    // 标题
    title?: string,
    // 颜色
    colors?: string[],
    // x轴数据
    x: string[],
    //series 数据 
    y: IExtendedYOption[],
    //单位
    units?: string[],
    //tooltip
    tooltip?: IObject,
    //是否双y轴
    doubleY?: boolean,
    //X轴标签样式
    XAxisLabel?: IObject<any>;
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
    colors: () => [],
    doubleY: false,
})
const headerY = $computed(() => { 
    return props.y.map(item =>({
        ...item,
        itemType: item.type === 'stackBar' ? 'bar' : item.type
    }))
})
const mixLineBarChart = useTemplateRef<any>('MixLineBarChartComponent')
const chartInstance = $computed(() => mixLineBarChart.value?.chart)

//计算series
const getSeries = (props: IProps) =>{
    const { y } = props;
    const normalSeries: Array<EChartsOption['series']> = []
    //堆叠图
    const stackSeries: Array<EChartsOption['series']> = []
    const stackGroups = new Map();

    y.forEach((item, index) => {
        const itemType = item.type || 'bar'
        if (itemType === 'bar') {
            const result = getBarSeries(item, index, props)
            normalSeries.push(result)
        }
        if (itemType === 'line') {
            const result = getLineSeries(item, index, props)
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
        const result = getStackSeries(i, props);
        stackSeries.push(...result);
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
    const series = getSeries(props)
    
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
            data: props.x.length>0 ? props.x : ['-'],
            splitLine: {
                show: false,
            },
            axisLine: {
                show: false,
            },
            axisLabel: {
                color: "#D2D2ED",
                fontSize: 12,
                lineHeight: 12,
                ...props.XAxisLabel
            },
            axisTick: {
                show: false
            }
        },
        yAxis: resultY,
        series
    } as EChartsOption
})
const $emit = defineEmits(['clickEffective', 'clickZr'])
// 点击事件
const clickEffective = (params: any) => {
    $emit('clickEffective', params)
}
const clickZr = (params: any) => {
    $emit('clickZr', params)
}

defineExpose({
    mixLineBarChart: computed(() => mixLineBarChart.value?.chart || null)
})

</script>

<template>
    <div class="EaconComponents EaconComponentsMixLineBarChart">
        <chartHeader :title :y="headerY" :chart="chartInstance" :colors></chartHeader>
        <div class="EaconComponentsMixLineBarChartUnit">
            <div v-for="item in units" class="EaconComponentsBarChartUnitItem">
                {{ item }}
            </div>
        </div>
        <Echarts class="EaconComponentsMixLineBarChartComponent" id="MixLineBarChart" ref="MixLineBarChartComponent" :option
        @clickEffective="clickEffective" @clickZr="clickZr"></Echarts>
    </div>
</template>

<style lang='scss' scoped>
.EaconComponentsMixLineBarChart {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .EaconComponentsMixLineBarChartUnit {
        display: flex;
        justify-content: space-between;
        color: #D2D2ED;
        font-size: .75rem;
    }

    .EaconComponentsMixLineBarChartComponent {
        height: 1%;
        flex: 1 1 auto;    }
}
</style>