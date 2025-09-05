<script setup lang="ts">
import { computed, nextTick, onMounted, useTemplateRef, watch } from 'vue';
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
    // x轴数据
    x: string[],
    //series 数据 
    y: IExtendedYOption[],
    //单位
    units?:string[],
    //tooltip
    tooltip?: IObject,
    //是否百分比
    percentage?: boolean,
    //X轴标签样式
    XAxisLabel?: IObject<any>;
    //其他数据传入
    anotherData?: IObject,
}

const props = withDefaults(defineProps<IProps>(), {
    x: () => [],
    y: () => [],
    colors: () => [],
})

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
        yAxis: {
            type: 'value',
            axisLabel: {
                color: "#D2D2ED",
                fontSize: 12,
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,.04)'
                }
            },
            axisLine: {
            },
            axisTick: {
                show: false
            },
            max: props.percentage ? 100 : undefined,
        },
        series: stackYData.map((item, idx) => ({
            type: 'bar',
            stack: 'total',
            name: item.name,
            data: item.data.length>0 ? item.data : [0],
            color: props.colors[idx % props.colors.length],
            barWidth: item.barWidth !== undefined ? item.barWidth : 12,
            itemStyle: {
                ...item.itemStyle,
                borderWidth: 2,
                borderRadius: item.itemStyle?.borderRadius !== undefined
                    ? item.itemStyle?.borderRadius : 12
            },
            tooltip: item.tooltip,
        })),
    } as EChartsOption
});


// 主动获取Y轴最大值的工具函数
const getYAxisMax = async () => {
    await nextTick()
    if (!stackBarChart.value.chart) return;
    const formatter = function(value: number, max: number) {
        if(value === 0) return value
        if (max >= 1e8) { 
            return (value / 1e8) + '亿';
        } else if (max >= 1e4) {
            return (value / 1e4) + '万';
        }
        return value;
    };

    // 获取Y轴模型
    const yAxisModel = stackBarChart.value.chart.getModel().getComponent('yAxis', 0);
    //  获取轴的范围（[min, max]），取第二个值为最大值
    const [_, max] = yAxisModel.axis.scale.getExtent();
    stackBarChart.value.chart.setOption({
        yAxis: {
            axisLabel: { formatter: (value: number) => formatter(value, max)}
        }
    });
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
    stackBarChart: computed(() => stackBarChart.value?.chart || null)
})
</script>

<template>
    <div class="EaconComponents EaconComponentsStackBarChart">
        <chartHeader :title :y :chart="chartInstance" :colors></chartHeader>
        <div class="EaconComponentsStackBarChartUnit">
            <div v-for="item in units" class="EaconComponentsStackBarChartUnitItem">
                {{ item }}
            </div>
        </div>
        <Echarts class="EaconComponentsStackBarChartComponent" id="StackBarChart" ref="StackBarChartComponent" :option
            @clickEffective="clickEffective" @clickZr="clickZr" @legendSelectChanged="legendSelectChanged"></Echarts>
    </div>
</template>

<style lang="scss" scoped>
.EaconComponentsStackBarChart {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .EaconComponentsStackBarChartUnit {
        display: flex;
        justify-content: space-between;
        color: #D2D2ED;
        font-size: .75rem;
    }

    .EaconComponentsStackBarChartComponent {
        height: 1%;
        flex: 1 1 auto;
    }
}
</style>