<!-- 基础柱状图 -->
<template>
    <div class="aki">
        <div class="test">
            <EaBarChart v-bind="chartOption" :theme></EaBarChart>
            <EaBarChart v-bind="chartOption" :theme></EaBarChart>
            <EaBarChart v-bind="chartOption" :theme></EaBarChart>
            <EaBarChart v-bind="chartOption" :theme></EaBarChart>
        </div>
        <div class="test">
            <EaBarChart v-bind="chartOption" :theme></EaBarChart>
            <EaBarChart v-bind="chartOption" :theme></EaBarChart>
            <EaBarChart v-bind="chartOption" :theme></EaBarChart>
            <EaBarChart v-bind="chartOption" :theme></EaBarChart>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { onBeforeUnmount, ref } from "vue";

const chartOption = ref({
    title: "基础柱状图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "运输设备",
            data: [10000, 2, 3, 4, 5],
        },
        {
            name: "采装设备",
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "辅助设备",
            data: [1, 2, 3, 4, 5]
        },
        {
            name: "运输设备1",
            data: [10000, 2, 3, 4, 5],
        },
        {
            name: "采装设备1",
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "辅助设备1",
            data: [1, 2, 3, 4, 5]
        }
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
.aki{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    .test{
        width: 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
    }
}
</style>