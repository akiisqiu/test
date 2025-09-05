<script setup lang="ts">
import Monaco from '@/components/Monaco/Monaco.vue'

const optionStr = $ref(`{
    title: "循环横向柱状图",
    y: ["公司1", "公司2", "公司3","公司4","公司5","公司6","公司7"],
    x: [1, 2, 3, 4,5,6,7],
    units:'单位：个',
    option:{
        "slides-per-view": 5,
        speed: 2000,
    }
}`)
const option = $computed(() => {
    try {
        return new Function(`return (${optionStr})`)()
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
            <EaLoopHorizontalBarChart v-bind="option"></EaLoopHorizontalBarChart>
        </div>
        <div class="options">
            <Monaco v-model="optionStr"></Monaco>
        </div>
    </div>
</template>

<style lang='scss' scoped>
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