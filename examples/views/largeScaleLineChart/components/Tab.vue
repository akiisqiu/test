<!-- 基础折线图 -->
<template>
    <EaLargeScaleLineChart v-bind="chartOption" :theme></EaLargeScaleLineChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const XData = new Array(100).fill('--').map((i,idx)=> 'test' + (idx + 1) )
const YData = new Array(100).fill(0).map((i,idx)=> Math.floor(Math.random() * 100) )
const chartOption = ref({
    title: "基础折线图",
    x: XData,
    y: [
        {
            name: "运输设备",
            data: YData,
        },
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h"]
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