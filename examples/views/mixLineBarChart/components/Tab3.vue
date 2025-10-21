<!-- 基础混合图 -->
<template>
    <EaMixLineBarChart v-bind="chartOption" :theme></EaMixLineBarChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
    title: "基础混合图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "运输设备",
            type: "line",
            data: [1, 6, 3, 4, 5],
        },
        {
            name: "采装设备",
            type:'stackBar',
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "辅助设备",
            type:'stackBar',
            data: [1, 2, 3, 4, 5]
        },
        {
            name: "stocking",
            type:'stackBar',
            stack: 'aki',
            data: [12, 4, 6, 9, 10],
        },
        {
            name: "panty",
            type:'stackBar',
            stack: 'aki',
            data: [4, 3, 17, 7, 5]
        },
        {
            name: "test",
            data: [14, 13, 7, 3, 7]
        }
    ],
    colors: [
        "#BBE478", "#A3E8E2", "#96F8B3", "#AB80FF", "#E7BD7D","#426170",
    ],
    units:["单位：h"],
    doubleY: true
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