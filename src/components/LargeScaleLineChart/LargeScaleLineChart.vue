<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';
import * as echarts from 'echarts'

import type { EChartsOption } from "echarts";
import type { IYOption } from '../ChartHeader/ChartHeader.vue'
import type { YAXisOption } from "echarts/types/dist/shared";
import { getLineSeries,createBaseY } from '../Echarts/ChartConfig'


export interface IExtendedYOption extends IYOption {
    lineStyle?:  IObject<any>;
    areaStyle?:  IObject<any>;
}

interface IProps {
    // 标题
    title?: string,
    // 颜色
    colors?: string[]
    // x轴数据
    x: string[],
    //series 数据 
    y: IExtendedYOption[],
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
    //数据条配置
    dataZoom?: IObject[],
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
    colors: () => [],
    doubleY: false,
    boundaryGap:true
})
const headerY = $computed(() => { 
    return props.y.map(item =>({
        ...item,
        itemType: 'line' as const
    }))
})

const lineChart = useTemplateRef<any>('LineChartComponent')
const chartInstance = $computed(() => lineChart.value?.chart)

const option = $computed<EChartsOption>(() => {
    //计算显示数据
    const series: Array<EChartsOption['series']> = []
    props.y.forEach((item, index) => {
        const result = getLineSeries(item, index, props)
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
            bottom: 35,
            containLabel: false,
        },
        xAxis: {
            data: props.x.length>0 ? props.x : ['-'],
            type: 'category',
            boundaryGap: props.boundaryGap,
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
                showMinLabel: true,
                showMaxLabel: true,
                ...props.XAxisLabel
            },
            axisTick: {
                show: false
            }
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
                backgroundColor: 'rgba(20,27,34,0.3)',
                borderRadius:0,
                dataBackground: {
                    // 背景边框颜色。
                    lineStyle: {
                        color: 'transparent',
                        shadowOffsetY: 30,
                    },
                    areaStyle:{
                        color:"#2b3544"
                    }
                },
                // 选中部分数据阴影的样式
                selectedDataBackground:{
                    lineStyle: {
                        color: '#64b7f8'
                    }
                },
                moveHandleSize:0,
                fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: "#9DF5E2" },
                    { offset: 1, color: "#70A8F5" },
                ]),
                borderColor: '#4F637D',
                textStyle: {
                    color: 'transparent',
                },
            },
        ],
    }
    return options1
});

// 主动获取Y轴最大值的工具函数
const getYAxisMax = async () => {
    await nextTick()
    if (!lineChart.value.chart) return;
    const formatter = function(value: number, max: number) {
        if(value === 0) return value
        if (max >= 1e8) { 
            return (value / 1e8) + '亿';
        } else if (max >= 1e4) {
            return (value / 1e4) + '万';
        }
        return value;
    };

    if(!props.doubleY){
        // 获取Y轴模型
        const yAxisModel = lineChart.value.chart.getModel().getComponent('yAxis', 0);
        //  获取轴的范围（[min, max]），取第二个值为最大值
        const [_, max] = yAxisModel.axis.scale.getExtent();
        lineChart.value.chart.setOption({
            yAxis: {
                axisLabel: { formatter: (value: number) => formatter(value, max)}
            }
        });
    } else {
        const yAxis0Model = lineChart.value.chart.getModel().getComponent('yAxis', 0);
        const yAxis1Model = lineChart.value.chart.getModel().getComponent('yAxis', 1);
        const [_, max0] = yAxis0Model.axis.scale.getExtent();
        const [__, max1] = yAxis1Model.axis.scale.getExtent();
        lineChart.value.chart.setOption({
            yAxis: [
                { axisLabel: { formatter: (value: number) => formatter(value, max0) } }, // 第0个Y轴
                { axisLabel: { formatter: (value: number) => formatter(value, max1) } }  // 第1个Y轴
            ]
        });
    }
};

onMounted(() => {
    getYAxisMax();
});

watch(
    () => option,
    () => {
        // 配置更新后延迟获取
        getYAxisMax()
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
    getYAxisMax()
    $emit('legendSelectChanged',params)
}
defineExpose({
    lineChart: computed(() => lineChart.value?.chart || null)
})

</script>

<template>
    <div class="EaconComponents EaconComponentsLineChart">
        <chartHeader :title :y="headerY" :chart="chartInstance" :colors></chartHeader>
        <div class="EaconComponentsLineChartUnit">
            <div v-for="item in units" class="EaconComponentsLineChartUnitItem">
                {{item}}
            </div>
        </div>
        <Echarts class="EaconComponentsLineChartComponent" id="LineChart" ref="LineChartComponent" :option @clickEffective="clickEffective" @clickZr="clickZr" @legendSelectChanged="legendSelectChanged"></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsLineChart {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    .EaconComponentsLineChartUnit{
        display: flex;
        justify-content: space-between;
        color: #D2D2ED;
        font-size: .75rem;
    }
    .EaconComponentsLineChartComponent {
        height: 1%;
        flex: 1 1 auto;
    }
}
</style>