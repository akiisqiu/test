<template>
    <div ref="componentRef" class="EaconComponents EaconComponentsEcharts">图表</div>
</template>

<script setup lang="ts">
import {
    useTemplateRef,
    nextTick,
    watch,
    onActivated,
    onUnmounted,
    onBeforeUnmount,
} from "vue";
import * as echarts from "echarts";
import type { ECharts, EChartsOption, SetOptionOpts } from "echarts";

export type IOption = EChartsOption;
export type IProps = {
    option: EChartsOption;
};
const props = defineProps<IProps>();

const component = useTemplateRef("componentRef");

let chart: ECharts | null = $shallowRef(null);

const init = () => {
    nextTick(() => {
        if (!component.value) return;
        chart = echarts.init(component.value);
        setOption(props.option);
    });
};
init();

const resize = () => chart?.resize();
window.addEventListener("resize", () => nextTick(resize));
onActivated(resize);
onBeforeUnmount(() => {
    window.removeEventListener("resize", resize);
    if (chart) {
        chart.dispose();
        chart = null;
    }
});
const setOption = (option: EChartsOption, config?: SetOptionOpts) => {
    chart?.setOption(option, config);
};
watch(
    () => props.option,
    () => setOption(props.option, {
        notMerge: true
    }),
    {
        deep: true,
    }
);


defineExpose({
    component,
    resize,
    setOption,
    chart: $$(chart),
});
</script>

<style lang="scss" scoped>
.EaconComponentsEcharts {
    width: 100%;
    height: 100%;
}
</style>
