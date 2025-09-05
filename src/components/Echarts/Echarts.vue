<template>
    <div ref="componentRef" class="EaconComponents EaconComponentsEcharts">图表</div>
</template>

<script lang="ts">
const defaultLoadingOptions = {
    text: 'loading',
    color: '#6FBDF0',
    textColor: '#000',
    maskColor: 'rgba(255, 255, 255, 0.1)',
    zlevel: 0,

    fontSize: 12,
    // 是否显示旋转动画（spinner）。从 `v4.8.0` 开始支持。
    showSpinner: true,
    // 旋转动画（spinner）的半径。从 `v4.8.0` 开始支持。
    spinnerRadius: 10,
    // 旋转动画（spinner）的线宽。从 `v4.8.0` 开始支持。
    lineWidth: 5,
    // 字体粗细。从 `v5.0.1` 开始支持。
    fontWeight: 'normal',
    // 字体风格。从 `v5.0.1` 开始支持。
    fontStyle: 'normal',
    // 字体系列。从 `v5.0.1` 开始支持。
    fontFamily: 'sans-serif'
}

</script>

<script setup lang="ts">
import {
    useTemplateRef,
    nextTick,
    watch,
    onActivated,
    onBeforeUnmount,
    onMounted,
} from "vue";
import * as echarts from "echarts";
import type { ECElementEvent, ECharts, EChartsOption, SetOptionOpts } from "echarts";
import { cloneDeep } from 'lodash-es'
import remToPx from '../../utils/rem2px'
import { isRecord } from "../../utils/public";
import type { IYOption } from "../ChartHeader/ChartHeader.vue";

export type IProps = {
    option: EChartsOption;
    //是否显示加载效果
    shoLoading?: boolean;
    //loading效果, Partial将所有属性转为可选属性
    loadingOptions?: Partial<typeof defaultLoadingOptions>,
};

export interface IExtendedYOption extends IYOption {
    type?: 'line' | 'bar' | 'stackBar';
    //bar图配置
    barWidth?: number | null;
    barMinWidth?: number;
    itemStyle?: IObject<any>;
    tooltip?: IObject<any>;
    // 折线样式
    lineStyle?:  IObject<any>;
    areaStyle?:  IObject<any>;
    // 0: 左侧y轴 1: 右侧y轴 不传第一条数据默认左侧轴，其余数据右侧y轴
    yAxisIndex?: number;
    //堆叠图配置 根据stack 名称相同的堆叠在一起
    stack?: string;
    //index 给堆叠图做索引使用 不需传输 堆叠图自行计算
    index?: number;
}

const props = withDefaults(defineProps<IProps>(), { 
    shoLoading: false,
    loadingOptions: () => {
        return { ...defaultLoadingOptions }
    }
});

const emit = defineEmits<{
    (e: 'clickEffective', params: ECElementEvent): void;
    (e: 'clickZr', params: ECElementEvent): void;
    (e: 'legendSelectChanged', params: any): void;
}>()
// 组件实例
const component = useTemplateRef("componentRef");

// 图表实例
let chart: ECharts | null = $shallowRef(null);

let i = $ref(0)
//转换数组 过滤转换rem
const remArray = [
    'barWidth', 'barMinWidth', 'borderWidth', 'borderRadius', 'margin',
    'left', 'top', 'right', 'bottom', 'fontSize', 'lineHeight', 'width', 'height', 'padding'
]

//根据最新结果自动修改
const resultOption = $computed<EChartsOption>(() => {
    i;
    const newOption = cloneDeep(props.option)
    // 递归转换rem
    const convert = (obj: Record<string, unknown>) => {
        if (!obj || !isRecord(obj)) return;
        Object.keys(obj).forEach(key => {
            if (!obj[key]) return
            // 需要转换rem的值
            if (remArray.includes(key)) {
                if (Array.isArray(obj[key])) {
                    obj[key] = obj[key].map((item: number) => remToPx(item))
                } else {
                    obj[key] = remToPx(obj[key]);
                }
                return;
            }
            // 处理数组
            if (Array.isArray(obj[key])) {
                obj[key].forEach(item => {
                    convert(item)
                });
                return;
            }
            // 递归处理嵌套对象
            if (isRecord(obj[key])) {
                convert(obj[key])
            }
        })
    };
    convert(newOption);
    return newOption;
});

const init = () => {
    if (!component.value) return;
    chart = echarts.init(component.value);
    // 整体点击
    chart.on('click', function (params: ECElementEvent) {
        emit('clickEffective', params)
    });
    // 图点击
    chart.getZr().on('click', function (params: ECElementEvent) {
        emit('clickZr', params)
    })
    //勾选图例
    chart.on('legendselectchanged', function () {
        if (!chart) return;
        const option = chart.getOption();
        const selected = Array.isArray(option.legend) ? option.legend[0].selected : null;
        //selected 为当前图例选中状态
        emit('legendSelectChanged',selected)
    });
    //加载loading效果与否
    addChartLoading('default', props.loadingOptions, props.shoLoading)
    // 配置option
    setOption(resultOption);
};

//是否配置加载效果
const addChartLoading = (type?: string, opts?: Partial<typeof defaultLoadingOptions>, shoLoading?: boolean) => {
    if (!shoLoading) return
    chart?.showLoading(type, opts);
}

const resize = () => {
    nextTick(() => {
        chart?.resize();
        i++;
    })
};
window.addEventListener("resize", resize);
onActivated(resize);

onMounted(() => {
    nextTick(() => {
        init();
    })
})

onBeforeUnmount(() => {
    window.removeEventListener("resize", resize);
    if (chart) {
        chart.dispose();
        chart = null;
    }
});
const setOption = (option: EChartsOption, config?: SetOptionOpts) => {
    chart?.hideLoading();
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
