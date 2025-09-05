<template>
    <EaBarChart v-bind="chartOption" @clickEffective="clickEffective" @clickZr="clickZr"
        ref="component" ></EaBarChart>
</template>
<script setup >
import { nextTick, onBeforeUnmount, useTemplateRef,ref } from 'vue';
let chartOption = ref({
    title: "堆叠柱状图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "系列1",
            data: [10, 20, 30, 40, 50],
        },
        {
            name: "系列2",
            data: [20, 30, 40, 50, 60],
        },
    ],
    units: ['单位：个'],
    colors: [
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    tooltip: {
        triggerOn: 'mousemove',
        enterable: false,
        alwaysShowContent: false,
        valueFormatter: (e) => e + "%",
    },
})

const chart = useTemplateRef('component')                // 获取实例
let chartClickTarget = null;                                // 判断有效图表点击事件
let seriesIndex = ref(null);                                // 点击的seriesIndex
let dataIndex = ref(null);                                  // 点击的dataIndex
let clickPosition = ref(null);                              // 点击位置判断
//切换到click 模式
const handleClick = (seriesIndex, dataIndex) => {
    if (chart.value?.barChart) {
        chart.value.barChart.dispatchAction({
            type: 'hideTip'
        });
        //更新配置
        chartOption.value = {
            ... chartOption.value,
            tooltip: {
                ...( chartOption.value.tooltip),
                alwaysShowContent: true,
                enterable: true,
                triggerOn: 'click',
                formatter: (params) => {
                    let seriesName = params[0].axisValueLabel
                    return `<div>${seriesName} 测试</div>`
                }
            },
        }
        //延迟显示tooltip
        nextTick(() => {
            setTimeout(() => {
                chart.value?.barChart?.dispatchAction({
                    type: 'showTip',
                    seriesIndex,
                    dataIndex
                })
            }, 0);
        });
    }
}
//mousemove 模式
const handleMousemove = () => {
    if (chart.value?.barChart) {
        //更新配置
        chartOption.value = {
            ... chartOption.value,
            tooltip: {
                triggerOn: 'mousemove',
                enterable: false,
                alwaysShowContent: false,
                valueFormatter: (e) => e + "%",
            },
        }
        chart.value.barChart.dispatchAction({
            type: 'hideTip'
        })
        chart.value.barChart.dispatchAction({
            type: 'showTip',
        })
    }
}
//页面判断点击事件
const handleClickMode = (e) => {
    const chartContainer = document.getElementById('StackBarChart');
    if (chartContainer && chartContainer.contains(e.target)) {
        const isSame = clickPosition.value  && clickPosition.value .x === e.clientX && clickPosition.value .y === e.clientY;
        // 图表点击判断是否同一位置，同一位置变回move模式
        if (isSame) {
            handleMousemove();
            clickPosition.value  = null;
        } else {
            // 非同一位置
            clickPosition.value  = {
                x: e.clientX,
                y: e.clientY
            }
        }
    } else {
        handleMousemove()
        clickPosition.value = null
    }
};
// 点击图表有效区域事件
const clickEffective = (params) => {
    chartClickTarget = params;
    seriesIndex.value = params.seriesIndex
    dataIndex.value  = params.dataIndex
}
// 点击图表区域事件
const clickZr = (params) => {
    setTimeout(() => {
        if (chartClickTarget && seriesIndex.value  !== null && dataIndex.value  !== null) {
            // 有效图表 转变为click事件
            handleClick(seriesIndex.value , dataIndex.value )
        } else {
            // 无效图表关闭click恢复move
            handleMousemove();
        }
        chartClickTarget = null;
    }, 0);
}
//监听页面点击触发handleClickMode
document.addEventListener('click', handleClickMode);
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickMode);
})
</script>
<style lang='scss' scoped>
</style>