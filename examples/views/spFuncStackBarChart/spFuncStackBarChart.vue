<script setup lang="ts">
import { nextTick, onBeforeUnmount, useTemplateRef } from 'vue';
import Monaco from '@/components/Monaco/Monaco.vue'
import { objectToString } from "@/utils/public";

let objStr = $ref({
    title: "堆叠柱状图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            label: "系列1",
            value: [10, 20, 30, 40, 50],
        },
        {
            label: "系列2",
            value: [20, 30, 40, 50, 60],
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
        valueFormatter: (e: string) => e + "%",
    },
})
//转字符串
let optionStr = $computed(() => {
    return objectToString(objStr)
})
const option = $computed(() => {
    try {
        return new Function(`return (${optionStr})`)()
    } catch (e) {
        console.warn('json 解析失败', e)
        return {
            series: []
        }
    }
})


const chart = useTemplateRef<any>('chartComponent') //获取实例
let chartClickTarget: null = null;                  //判断有效图表点击事件
let seriesIndex = $ref<number | null>(null);        // 点击的seriesIndex
let dataIndex = $ref<number | null>(null);          // 点击的dataIndex
let clickPosition = $ref<{ x: number, y: number } | null>(null);//点击位置判断
//切换到click 模式
const handleClick = (seriesIndex: number, dataIndex: number) => {
    if (chart.value?.chart) {
        chart.value.chart.dispatchAction({
            type: 'hideTip'
        });
        //更新配置
        objStr = {
            ...objStr,
            tooltip: {
                //demo 断言类型
                ...(objStr.tooltip as any),
                alwaysShowContent: true,
                enterable: true,
                triggerOn: 'click',
                formatter: (params: Array<any>) => {
                    console.log('ppppppp',params)
                    let seriesName = params[0].axisValueLabel
                    return `<div>${seriesName} 测试</div>`
                }
            },
        }
        //延迟显示tooltip
        nextTick(() => {
            setTimeout(() => {
                chart.value?.chart?.dispatchAction({
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
    if (chart.value?.chart) {
        //更新配置
        objStr = {
            ...objStr,
            tooltip: {
                triggerOn: 'mousemove',
                enterable: false,
                alwaysShowContent: false,
                valueFormatter: (e) => e + "%",
            },
        }
        chart.value.chart.dispatchAction({
            type: 'hideTip'
        })
        chart.value.chart.dispatchAction({
            type: 'showTip',
        })
    }
}
//页面判断点击事件
const handleClickMode = (e: MouseEvent) => {
    const chartContainer = document.getElementById('StackBarChart');
    if (chartContainer && chartContainer.contains(e.target as Node)) {
        const isSame = clickPosition && clickPosition.x === e.clientX && clickPosition.y === e.clientY;
        // 图表点击判断是否同一位置，同一位置变回move模式
        if (isSame) {
            handleMousemove();
            clickPosition = null;
        } else {
            // 非同一位置
            clickPosition = {
                x: e.clientX,
                y: e.clientY
            }
        }
    } else {
        handleMousemove()
        clickPosition = null
    }
};
// 点击图表有效区域事件
const clickEffective = (params: any) => {
    chartClickTarget = params;
    seriesIndex = params.seriesIndex
    dataIndex = params.dataIndex
}
// 点击图表区域事件
const clickZr = (params: any) => {
    setTimeout(() => {
        if (chartClickTarget && seriesIndex !== null && dataIndex !== null) {
            // 有效图表 转变为click事件
            handleClick(seriesIndex, dataIndex)
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

<template>
    <div class="echarts">
        <div class="BarContent">
            <div class="preview">
                <EaStackBarChart v-bind="option" @clickEffective="clickEffective" @clickZr="clickZr"
                    ref="chartComponent" ></EaStackBarChart>
            </div>
            <div class="options">
                <Monaco v-model="optionStr"></Monaco>
            </div>
        </div>
    </div>
</template>

<style lang='scss' scoped>
.echarts {
    display: flex;
    flex-direction: column;
    padding: 20px;

    .EaconComponentsPageTabs {
        width: 100%;
        border-bottom: var(--ea-border);
    }

    .BarContent {
        padding-top: 20px;
        display: flex;
        flex: 1 1 auto;
        height: 1%;
        gap: 20px;

        .preview,
        .options {
            width: 1%;
            flex: 1 1 auto;
            height: 100%;
        }

        .preview {
            display: flex;
            flex-direction: column;
            gap: 1rem;

            .EaconComponentsStackBarChart {
                flex: 1 1 auto;
            }
        }
    }
}
</style>