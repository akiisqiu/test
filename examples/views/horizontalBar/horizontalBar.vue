<script setup lang="ts">
import Monaco from '@/components/Monaco/Monaco.vue'
import SfcComponent from '@/components/SfcComponent/SfcComponent.vue'
import * as ChartComp from "./components";


const formValue = $ref(ChartComp.Tab);
</script>

<template>
    <div class="echarts">
        <div class="preview">
            <SfcComponent :code="formValue"></SfcComponent>
        </div>
        <div class="options">
            <Monaco v-model="formValue"></Monaco>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.echarts {
    display: flex;
    padding: 20px;
    gap: 20px;
    &>div {
        width: 1%;
        flex: 1 1 auto;
        height: 100%;
    }
}
</style>
