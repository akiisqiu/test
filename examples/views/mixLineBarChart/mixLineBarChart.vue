<script setup lang="ts">
import type { IPageTabsOption } from "eacon-components";
import Monaco from '@/components/Monaco/Monaco.vue'
import SfcComponent from '@/components/SfcComponent/SfcComponent.vue'
import * as ChartComp from "./components/Tab";

const tabs = $ref<IPageTabsOption[]>([
    {
        label: "基础混合图",
        value: ChartComp.Tab1,
    },
    {
        label: "基础混合图-双轴",
        value: ChartComp.Tab2,
    },
    {
        label: "基础混合图-堆叠折线",
        value: ChartComp.Tab3,
    },
]);

const formValue = $ref(tabs[0]);
</script>

<template>
    <div class="echarts">
        <EaPageTabs :options="tabs" v-model="formValue"></EaPageTabs>
        <div class="mixLineBarChartContent">
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
    .mixLineBarChartContent{
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
