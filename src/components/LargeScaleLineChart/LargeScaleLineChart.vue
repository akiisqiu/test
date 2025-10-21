<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from "echarts";
import type { ISeriesOption } from '../Echarts/Echarts.vue';
import { getLineSeries,createBaseY } from '../Echarts/ChartConfig'
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
    //是否双y轴
    doubleY?: boolean,
    //X轴标签样式
    XAxisLabel?:IObject<any>,
    //是否有间隔
    boundaryGap?: boolean,
    //是否显示图例
    showLegend?: boolean
    //数据条配置
    dataZoom?: IObject[],
    //主题色
    theme?: string
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
    colors: () => [],
    doubleY: false,
    boundaryGap:true,
    showLegend:true
})
const headerY = $computed(() => { 
    if (props.showLegend) {
        return props.y.map(item =>({
            ...item,
            itemType: 'line' as const
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

const lineChart = useTemplateRef<any>('LineChartComponent')
const chartInstance = $computed(() => lineChart.value?.chart)

const option = $computed<EChartsOption>(() => {
    //计算显示数据
    const series: EChartsOption['series'] = [];
    props.y.forEach((item, index) => {
        const result = getLineSeries(item, index, props.doubleY,props.colors)
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
            left: 3,
            top: 12,
            right: 0,
            bottom: 35,
        },
        xAxis: {
            data: props.x.length>0 ? props.x : ['-'],
            type: 'category',
            boundaryGap: props.boundaryGap,
            axisLabel: {
                fontSize: 12,
                lineHeight: 12,
                showMinLabel: true,
                showMaxLabel: true,
                ...props.XAxisLabel
            },
        },
        yAxis: resultY,
        series,
        dataZoom: [
            //滚动条
            {
                type: 'inside',
            },
            {
                show: true,
                type: 'slider',
                //拖动时，是否实时更新系列的视图。如果设置为 false，则只在拖拽结束的时候更新。
                realtime: true,
                //数据窗口范围的起始百分比
                start: 0,   // 0%
                end:100,   // 100%
                xAxisIndex: [0],
                bottom:0,
                left: 3,
                right: 3,
                height: 10,  
            },
        ],
    }
    return options1
});


onMounted(async() => {
    await nextTick()
    getYAxisMax(lineChart.value.chart, props.doubleY);
});

watch(
    () => [option,props.theme],
    () => {
        // 配置更新后延迟获取
        getYAxisMax(lineChart.value.chart, props.doubleY);
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
    getYAxisMax(lineChart.value.chart, props.doubleY);
    $emit('legendSelectChanged',params)
}
defineExpose({
    lineChart: computed(() => lineChart.value?.chart || null)
})

</script>

<template>
    <div class="EaconComponents EaconComponentsLineChart">
        <chartHeader :title :y="headerY" :chart="chartInstance" :colors="headerColors"></chartHeader>
        <div class="EaconComponentsLineChartUnit">
            <div v-for="item in units" class="EaconComponentsLineChartUnitItem">
                {{item}}
            </div>
        </div>
        <Echarts class="EaconComponentsLineChartComponent" id="LineChart"
            ref="LineChartComponent" :option @clickEffective="clickEffective" @clickZr="clickZr" 
            @legendSelectChanged="legendSelectChanged" :theme>
        </Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsLineChart {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .EaconComponentsLineChartUnit{
        display: flex;
        justify-content: space-between;
        color: var(--ea-text2);
        font-size: .75rem;
    }
    .EaconComponentsLineChartComponent {
        height: 1%;
        flex: 1 1 auto;
    }
}
</style>