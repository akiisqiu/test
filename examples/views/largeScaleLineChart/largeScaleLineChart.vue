<script setup lang="ts">
import Monaco from '@/components/Monaco/Monaco.vue'
import type { IPageTabsOption } from "eacon-components";
import SfcComponent from '@/components/SfcComponent/SfcComponent.vue'
import * as ChartComp from "./components/Tab";

const formValue = $ref(ChartComp.Tab);
</script>

<template>
    <div class="echarts">
        <div class="LineContent">
            <div class="preview">
                <SfcComponent :code="formValue"></SfcComponent>
            </div>
            <div class="options">
                <Monaco v-model="formValue"></Monaco>
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
