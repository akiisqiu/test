<script setup lang="ts">
import * as echarts from "echarts";
import Monaco from '@/components/Monaco/Monaco.vue'
import {optionStr} from './config'
const tabs = $ref([
    {
        label: "堆叠柱状图",
        value: "tab1",
    },
    {
        label: "依据百分比堆叠的柱状图",
        value: "tab2",
    },
    {
        label: "自定义堆叠柱状图",
        value: "tab3",
    },
    {
        label: "自定义提示框",
        value: "tab4",
    },
]);
const formValue = $ref({ tab: tabs[0] });
//解包
const rawOptionStr = $(optionStr) 

const option = $computed(() => {
    try {
        return new Function('echarts', `return ${rawOptionStr[formValue.tab.value]}`)(echarts);
    } catch (e) {
        console.warn('配置解析失败', e)
        return { series: [] }
    }
})

//上方数据
let tab1Data= new Function( `return ${rawOptionStr['tab1']}`)()
const leftTitle = $computed(()=>{
    return tab1Data.y[0].label
})
const rightTitle = $computed(()=>{
    return tab1Data.y[1].label
})
const leftValue = $computed(()=>{
    return tab1Data.y[0].data.reduce((a: number, b: number) => a + b, 0)
})
const rightValue = $computed(()=>{
    return tab1Data.y[1].data.reduce((a: number, b: number) => a + b, 0)
})
const topColors = $computed(()=>{
    return tab1Data.colors
})
</script>

<template>
    <div class="echarts">
        <EaPageTabs :options="tabs" v-model="formValue.tab"></EaPageTabs>
        <div class="BarContent">
            <div class="preview">
                <EaComparisonTips  v-show="formValue.tab.value === 'tab1'" :leftValue :rightValue :leftTitle :rightTitle :colors="topColors">
                    <EaHorizontalComparisonChart :leftValue :rightValue :colors="topColors"> </EaHorizontalComparisonChart>
                </EaComparisonTips>
                <EaStackBarChart v-bind="option"></EaStackBarChart>
            </div>
            <div class="options">
                <Monaco v-model="optionStr[formValue.tab.value]"  :key="formValue.tab.value" ></Monaco>
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
    .BarContent{
        padding-top: 20px;
        display: flex;
        flex: 1 1 auto;
        height: 1%;
        gap: 20px;
        .preview,.options{
            width: 1%;
            flex: 1 1 auto;
            height: 100%;
        }
        .preview{
            display: flex;
            flex-direction: column;
            gap: 1rem;
            .EaconComponentsStackBarChart{
                flex: 1 1 auto;
            }
        }
    }
}
</style>