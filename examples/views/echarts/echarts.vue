<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import Monaco from '@/components/Monaco/Monaco.vue'

const optionStr = $ref(`{
    "xAxis": {
        "type": "category",
        "data": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    },
    "yAxis": {
        "type": "value"
    },
    "series": [
        {
            "data": [150, 230, 224, 218, 135, 147, 260],
            "type": "line"
        }
    ]
}`)
const option: EChartsOption = $computed(() => {
    try {
        return JSON.parse(optionStr)
    } catch (e) {
        console.warn('json 解析失败', e)
        return {
            series: []
        }
    }
})
</script>

<template>
    <div class="echarts">
        <div class="preview">
            <EaEcharts :option></EaEcharts>
        </div>
        <div class="options">
            <Monaco v-model="optionStr"></Monaco>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.echarts {
    display: flex;
    gap: 20px;
    padding: 20px;
    &>div {
        width: 1%;
        flex: 1 1 auto;
        height: 100%;
    }
}
</style>
