<script setup lang="ts">
import Monaco from '@/components/Monaco/Monaco.vue'
import {optionStr} from './config'
const tabs = $ref([
    {
        label: "基础柱状图",
        value: "tab1",
    },
    {
        label: "自定义单个柱子颜色",
        value: "tab2",
    },
    {
        label: "柱状图自定义",
        value: "tab3",
    },
    {
        label: "带背景色的柱状图",
        value: "tab4",
    },
    {
        label: "自定义提示框",
        value: "tab5",
    },
]);
const formValue = $ref({ tab: tabs[0] });
//解包
const rawOptionStr = $(optionStr) 

const option = $computed(() => {
    try {
        return new Function(`return (${rawOptionStr[formValue.tab.value]})`)()
    } catch (e) {
        console.warn('配置解析失败', e)
        return { series: [] }
    }
})


</script>

<template>
    <div class="echarts">
        <EaPageTabs :options="tabs" v-model="formValue.tab"></EaPageTabs>
        <div class="BarContent">
            <div class="preview">
                <EaBarChart v-bind="option"></EaBarChart>
            </div>
            <div class="options">
                <Monaco v-model="optionStr[formValue.tab.value]"  :key="formValue.tab.value" ></Monaco>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
