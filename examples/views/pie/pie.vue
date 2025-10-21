<script setup lang="ts">
import Monaco from '@/components/Monaco/Monaco.vue'
import SfcComponent from '@/components/SfcComponent/SfcComponent.vue'
import * as ChartComp from "./components";

const tabs = $ref([
    {
        label: "基础饼图",
        value: ChartComp.Tab1,
    },
    {
        label: "圆角环形图",
        value: ChartComp.Tab2,
    },
    {
        label: "半环形图",
        value: ChartComp.Tab3,
    },
]);

const formValue = $ref(tabs[0]);
</script>


<template>
    <div class="echarts">
        <EaPageTabs :options="tabs" v-model="formValue"></EaPageTabs>
        <div class="PieContent">
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
    .PieContent{
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