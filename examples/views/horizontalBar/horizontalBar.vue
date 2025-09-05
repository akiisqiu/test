<script setup lang="ts">
import Monaco from '@/components/Monaco/Monaco.vue'

const optionStr = $ref(`{
    title: "横向柱状图",
    y: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    x: [
        1, 2, 3, 4,  
        {
            value:5,
            itemStyle: {
                "color": "#6EF366"
            }
        },
    ],
    units:'单位：个',
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
            <EaHorizontalBarChart v-bind="option"></EaHorizontalBarChart>
        </div>
        <div class="options">
            <Monaco v-model="optionStr"></Monaco>
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
