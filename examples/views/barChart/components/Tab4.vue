<!-- 带背景色的柱状图 -->
<template>
    <EaBarChart v-bind="chartOption"></EaBarChart>
</template>

<script lang='ts' setup>
import { ref } from "vue";

const chartOption = ref({
    title: "基础柱状图-带背景色的柱状图",
    x: ["公司1", "公司2", "公司3"],
    y: [
        {
            data: [1, 2, 3, 4, 5],
            //带背景色
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)',
                borderRadius:12
            },
        }
    ],
    units:["单位：h"]
})
</script>

<style scoped>
</style>