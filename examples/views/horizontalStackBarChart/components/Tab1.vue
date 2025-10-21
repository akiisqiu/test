<!-- 横向堆叠柱状图 -->
<template>
    <EaHorizontalStackBarChart v-bind="chartOption":theme></EaHorizontalStackBarChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
    title: "横向堆叠柱状图",
    y: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    x: [
        {
            name: "系列1",
            data: [10, 20, 30, 40, 50],
        },
        {
            name: "系列2",
            data: [20, 30, 40, 50, 60],
        },
        {
            name: "系列3",
            data: [30, 40, 50, 60,70],
        },
    ],
    units:'单位：个',
    xAxisLabel:true,
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
})
let theme = ref(localStorage.getItem("theme") || "white");
const changeTheme = (e: string) => {
    theme.value = e;
};
window.changeTheme.add(changeTheme);
onBeforeUnmount(() => window.changeTheme.delete(changeTheme));
</script>

<style scoped>
</style>