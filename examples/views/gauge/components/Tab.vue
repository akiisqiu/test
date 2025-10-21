<!-- 仪表 -->
<template>
    <EaGauge v-bind="chartOption"></EaGauge>
</template>

<script lang='ts' setup>
import { ref } from "vue";
const chartOption = ref({
    value: 10,
    colors: ["#435F70", "#94F9F0"],
    radius:'80%',
    name: "仪表test",
    title:{
        show:true,
        offsetCenter:[0,0],
        color:'#000',
        fontStyle :'normal',
        fontWeight :'normal',
        fontSize :16
        //ineHeight
    }
})
</script>

<style scoped>
</style>