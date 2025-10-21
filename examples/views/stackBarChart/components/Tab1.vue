<!-- 堆叠柱状图 -->
<template>
    <div class="chart-container">
        <EaComparisonTips  :leftValue :rightValue :leftTitle :rightTitle :colors="topColors">
            <EaHorizontalComparisonChart :leftValue :rightValue :colors="topColors"> </EaHorizontalComparisonChart>
        </EaComparisonTips>
        <EaStackBarChart v-bind="chartOption" :theme></EaStackBarChart>
    </div>
</template>

<script lang='ts' setup>
import { onBeforeUnmount,computed, ref } from "vue";
//上方数据
const leftTitle = computed(()=>{
    return chartOption.value.y[0].name
})
const rightTitle = computed(()=>{
    return chartOption.value.y[1].name
})
const leftValue = computed(()=>{
    return chartOption.value.y[0].data.reduce((a: number, b: number) => a + b, 0)
})
const rightValue = computed(()=>{
    return chartOption.value.y[1].data.reduce((a: number, b: number) => a + b, 0)
})
const topColors = computed(()=>{
    return chartOption.value.colors
})
const chartOption = ref({
    title: "堆叠柱状图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            name: "系列1",
            data: [10, 20, 30, 40, 50],
        },
        {
            name: "系列2",
            data: [20, 30, 40, 50, 60],
        },
    ],
    units:['单位：个'],
    colors: [
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
.chart-container{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    .EaconComponentsStackBarChart{
        flex: 1 1 auto;
    }
}
</style>