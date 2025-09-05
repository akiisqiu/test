<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef, watch } from 'vue';
import ChartHeader from '../ChartHeader/ChartHeader.vue';
import Echarts from '../Echarts/Echarts.vue';

import type { EChartsOption } from "echarts";
import type { IExtendedYOption } from '../Echarts/Echarts.vue';
import type { YAXisOption } from "echarts/types/dist/shared";
import { getBarSeries,createBaseY } from '../Echarts/ChartConfig'


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


const barChart = useTemplateRef<any>('BarChartComponent')
const chartInstance = $computed(() => barChart.value?.chart)


const option = $computed(() => {
    //计算显示数据
    const series: Array<EChartsOption['series']> = []
    props.y.forEach((item, index) => {
        const result = getBarSeries(item, index, props)
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
            type: 'category',
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
        series,
    } as EChartsOption
});



// 主动获取Y轴最大值的工具函数
const getYAxisMax = async () => {
    await nextTick()
    if (!barChart.value.chart) return;
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
        const yAxisModel = barChart.value.chart.getModel().getComponent('yAxis', 0);
        //  获取轴的范围（[min, max]），取第二个值为最大值
        const [_, max] = yAxisModel.axis.scale.getExtent();
        barChart.value.chart.setOption({
            yAxis: {
                axisLabel: { formatter: (value: number) => formatter(value, max)}
            }
        });
    } else {
        const yAxis0Model = barChart.value.chart.getModel().getComponent('yAxis', 0);
        const yAxis1Model = barChart.value.chart.getModel().getComponent('yAxis', 1);
        const [_, max0] = yAxis0Model.axis.scale.getExtent();
        const [__, max1] = yAxis1Model.axis.scale.getExtent();
        barChart.value.chart.setOption({
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
    barChart: computed(() => barChart.value?.chart || null)
})

</script>

<template>
    <div class="EaconComponents EaconComponentsBarChart">
        <chartHeader :title :y :chart="chartInstance" :colors></chartHeader>
        <div class="EaconComponentsBarChartUnit">
            <div v-for="item in units" class="EaconComponentsBarChartUnitItem">
                {{ item }}
            </div>
        </div>
        <Echarts class="EaconComponentsBarChartComponent" id="BarChart" ref="BarChartComponent" :option
            @clickEffective="clickEffective" @clickZr="clickZr" @legendSelectChanged="legendSelectChanged"></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsBarChart {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .EaconComponentsBarChartUnit {
        display: flex;
        justify-content: space-between;
        color: #D2D2ED;
        font-size: .75rem;
    }

    .EaconComponentsBarChartComponent {
        height: 1%;
        flex: 1 1 auto;    }
}
</style>
