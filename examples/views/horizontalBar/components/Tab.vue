<!-- 横向柱状图 -->
<template>
    <EaHorizontalBarChart v-bind="chartOption":theme></EaHorizontalBarChart>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
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