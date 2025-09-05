<script setup lang="ts">
import Monaco from '@/components/Monaco/Monaco.vue'
import type { IPageTabsOption } from "eacon-components";
import SfcComponent from '@/components/SfcComponent/SfcComponent.vue'
import * as ChartComp from "./components/index";

const tabs = $ref<IPageTabsOption[]>([
    {
        label: "基础柱状图",
        value: ChartComp.Tab1,
    },
    {
        label: "自定义单个柱子颜色",
        value: ChartComp.Tab2,
    },
    {
        label: "柱状图自定义",
        value: ChartComp.Tab3,
    },
    {
        label: "带背景色的柱状图",
        value: ChartComp.Tab4,
    },
    {
        label: "自定义提示框",
        value: ChartComp.Tab5,
    },
    {
        label: "双轴",
        value: ChartComp.Tab6,
    },
    {
        label: "点击功能示例",
        value: ChartComp.Tab7,
    },
]);

const formValue = $ref(tabs[0]);
</script>

<template>
    <div class="echarts">
        <EaPageTabs :options="tabs" v-model="formValue"></EaPageTabs>
        <div class="BarContent">
            <div class="preview">
                <SfcComponent :code="formValue.value"></SfcComponent>
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
