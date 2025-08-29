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
const leftValue = $computed(()=>{
    let data= new Function( `return ${rawOptionStr['tab1']}`)()
    return data.y[0].value.reduce((a: number, b: number) => a + b, 0)
})
const rightValue = $computed(()=>{
    let data= new Function( `return ${rawOptionStr['tab1']}`)()
    return data.y[1].value.reduce((a: number, b: number) => a + b, 0)
})
const topColors = $computed(()=>{
    let data= new Function( `return ${rawOptionStr['tab1']}`)()
    return data.colors
})
</script>

<template>
    <div class="echarts">
        <EaPageTabs :options="tabs" v-model="formValue.tab"></EaPageTabs>
        <div class="BarContent">
            <div class="preview">
                <EaHorizontalComparisonChart v-show="formValue.tab.value === 'tab1'" :leftValue :rightValue :colors="topColors"> </EaHorizontalComparisonChart>
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
        &>div {
            width: 1%;
            flex: 1 1 auto;
            height: 100%;
        }
    }
}
</style>