<!-- 带背景色的柱状图 -->
<template>
    <EaLineChart v-bind="chartOption" :theme></EaLineChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
    title: "基础折线图-双轴 ",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "运输设备",
            data: [10000000000000, 21, 13, 24, 15],
        },
        {
            name: "采装设备",
            data: [ 0.0001,
                0.0001,
                0.0000011,
                0.00000009,
                0.000006
            ],
        },
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h",'单位：t'],
    doubleY:true,
    boundaryGap:false
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