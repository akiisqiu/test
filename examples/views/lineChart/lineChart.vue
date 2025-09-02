<script setup lang="ts">
import Monaco from '@/components/Monaco/Monaco.vue'
import config from './config'
import type { IPageTabsOption } from "eacon-components";
import { watch } from "vue";
import { objectToString } from "@/utils/public";

// tab标签
const tabOptions = $computed<IPageTabsOption[]>(() => {
    const values = Object.values(config)
    return values.map(item => ({
        label: item.title,
        value: objectToString(item),
    }))
})
const formValue = $ref(tabOptions[0]);

// 图表配置
let chartOption = $ref({})
watch(() => formValue.value, (nVal, oVal) => {
    try {
        chartOption = new Function(`return (${nVal})`)()
    } catch (e) {
        console.warn('配置解析失败不更新', e)
    }
}, { immediate: true})



</script>

<template>
    <div class="echarts">
        <EaPageTabs :options="tabOptions" v-model="formValue"></EaPageTabs>
        <div class="LineContent">
            <div class="preview">
                <EaLineChart v-bind="chartOption"></EaLineChart>
            </div>
            <div class="options">
                <Monaco v-model="formValue.value"></Monaco>
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
    .LineContent{
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
