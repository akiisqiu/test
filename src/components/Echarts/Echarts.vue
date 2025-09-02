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
import cloneDeep from 'lodash/cloneDeep'
import remToPx from '../../utils/rem2px'
import {getActualWidthOfChars,getMaxWidth,debounce} from '../../utils/chart'

export type IOption = EChartsOption;
export type IProps = {
    option: EChartsOption;
    bound?:boolean;
};
const props = withDefaults(defineProps<IProps>(), { 
    bound: true 
});

const component = useTemplateRef("componentRef");

let chart: ECharts | null = $shallowRef(null);

//转换数组 过滤转换rem
let i = $ref(0)
const remArray = ['barWidth', 'barMinWidth','borderWidth', 'borderRadius', 'margin',
    'left', 'top', 'right', 'bottom', 'fontSize', 'lineHeight','width', 'height','padding']

//计算两侧宽度
const newOptions =$computed(() => { 
    const { xAxis, grid, series,yAxis }: any = props.option
    if(yAxis.type == 'category' || props.bound){
        return props.option
    }else{
        // 计算xAxis最大宽度
        let maxXAxisItem: (string | number)[] = []
            if (Array.isArray(xAxis) && xAxis.length > 0 && xAxis.data) {
                let xAxisArr: (number | string)[] = []
                xAxis.forEach((el) => xAxisArr = [...xAxisArr, ...el.data])
                maxXAxisItem = [xAxisArr[0], xAxisArr[xAxisArr.length - 1]]
            } else if (xAxis) {
                maxXAxisItem = [xAxis!.data[0], xAxis!.data[xAxis!.data.length - 1]]
            }
            let leftXAxisWidth = getActualWidthOfChars(maxXAxisItem[0].toString()) || 0
            let rightXAxisWidth = getActualWidthOfChars(maxXAxisItem[1].toString()) || 0
            //y轴最大值
            let maxYAxisArr: number[] = []
            if (Array.isArray(series) && series.length > 0 && series) {
                series.forEach((el: any) => maxYAxisArr = [...maxYAxisArr, ...el.data])
            } else if (series) {
                maxYAxisArr = series.data
            }
            let leftYAxisWidth = getMaxWidth([Math.min(...maxYAxisArr), Math.max(...maxYAxisArr)])
            //处理为最新的options
            const result = {
                ...props.option,
                grid: {
                    ...grid,
                    containLabel: false,
                    left: leftYAxisWidth > leftXAxisWidth / 2 ? leftYAxisWidth : leftXAxisWidth / 2,
                    right: rightXAxisWidth / 2
                }
            }
            return result
    }
});
//根据最新结果自动修改
const resultOption = $computed(() => {
    i;
    const newOption = cloneDeep(newOptions)
    const convert = (obj: any) => {
        if (!obj || typeof obj !== 'object') return;
        Object.keys(obj).forEach(key => {
            if (remArray.includes(key)) {
                if (typeof obj[key] === 'number') {
                    obj[key] = remToPx(obj[key]);
                } else if (Array.isArray(obj[key])) {
                    obj[key] = obj[key].map((item: any) =>
                        typeof item === 'number' ? remToPx(item) : item
                    );
                }
                return; 
            }
            if (key === 'yAxis' && Array.isArray(obj[key])) {
                console.log("🚀avavavavaavavv:", key)
                obj[key].forEach(item => {
                    console.log("🚀 ~ convert ~ item:", item)
                    convert(item)
                });
                return;
            }
            if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
            console.log("🚀 ~ convert ~ key:", key)
                convert(obj[key]);
            }
        })
    };

    convert(newOption);
    console.log("🚀 ~ newOption:", newOption)
    return newOption;
});
const $emit = defineEmits(['clickEffective', 'clickZr'])
const init = () => {
    nextTick(() => {
        if (!component.value) return;
        chart = echarts.init(component.value);
        chart.on('click', function (params) {
            $emit('clickEffective', params)
        });
        chart.getZr().on('click', function (params) {
            $emit('clickZr', params)
        })
        if (resultOption) {
            setOption(resultOption);
        }
    });
};
init();

const resize = () => {
    nextTick(() => {
        chart?.resize();
        i++;
    })
};
window.addEventListener("resize", resize);
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
    () => resultOption,
    () => {
        setOption(resultOption, { notMerge: true })
    },
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
