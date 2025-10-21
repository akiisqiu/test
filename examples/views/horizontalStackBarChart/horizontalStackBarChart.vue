<script setup lang="ts">
import Monaco from '@/components/Monaco/Monaco.vue'
import SfcComponent from '@/components/SfcComponent/SfcComponent.vue'
import * as ChartComp from "./components/index";

const tabs = $ref([
    {
        label: "横向堆叠柱状图",
        value: ChartComp.Tab1,
    },
    {
        label: "依据百分比的横向堆叠柱状图",
        value: ChartComp.Tab2,
    },
    {
        label: "自定义横向堆叠柱状图",
        value: ChartComp.Tab3,
    },
    {
        label: "自定义提示框",
        value: ChartComp.Tab4,
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