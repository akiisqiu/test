import type { EChartsOption, SeriesOption } from 'echarts';
import type { ISeriesOption } from './Echarts.vue'; 
import type { YAXisOption } from 'echarts/types/dist/shared';

//基础Y轴
export const createBaseY = (): YAXisOption => ({
    type: 'value',
    axisLabel: {
        fontSize: 12,
        showMinLabel:true,
        showMaxLabel:true,
        hideOverlap: true
    },
})

//配置柱状图
export const getBarSeries = (item: ISeriesOption, idx: number, doubleY?:Boolean,colors?:string[]): SeriesOption=> {
    let yAxisIndex = 0
    // 双y轴
    if(doubleY){
        yAxisIndex = (item.yAxisIndex ?? (idx > 1 ? 1 : idx));
    }

    return {
        ...item,
        type: 'bar',
        data: item.data.length > 0 ? item.data : [0],
        color: colors && colors[idx % colors.length],
        yAxisIndex: yAxisIndex,
        barWidth: item.barWidth === null ? 'undefined' : (item.barWidth !== undefined ? item.barWidth : 12),
        barMaxWidth: item.barMinWidth,
        barMinHeight: 4,
        itemStyle: {
            ...(item.itemStyle || {}),
            borderWidth: 2,
            borderRadius:
                item.itemStyle && 'borderRadius' in item.itemStyle
                    ? item.itemStyle.borderRadius
                    : 12,
        },
    };
};
//配置折线图
export const getLineSeries = (item: ISeriesOption, idx: number,doubleY?:Boolean,colors?:string[]): SeriesOption  => {
    let yAxisIndex = 0
    // 双y轴
    if(doubleY){
        yAxisIndex = (item.yAxisIndex ?? (idx > 1 ? 1 : idx));
    }
    return {
        ...item,
        type: 'line',
        data: item.data.length > 0 ? item.data : [0],
        color: colors && colors[idx % colors.length],
        yAxisIndex: yAxisIndex,
        lineStyle: {
            width: 3,
            ...item.lineStyle,
        },
        areaStyle: item.areaStyle,
        smooth: true,
        symbol:'none',
    }
};
//配置堆叠图
export const getStackSeries = ( stackItems: ISeriesOption[], doubleY?:Boolean,colors?:string[]): SeriesOption[]   => {
    const stackName = stackItems[0]?.stack || 'total';
    return stackItems.map((item) => {
        let yAxisIndex = 0
        // 双y轴
        if(doubleY &&item.index ){
            yAxisIndex = (item.yAxisIndex ?? (item.index > 1 ? 1 : item.index));
        }
        return {
            ...item, 
            type: 'bar' , 
            stack: stackName, 
            data: item.data.length > 0 ? item.data : [0],
            color: colors && item.index !== undefined? colors[item.index % colors.length]: undefined,
            barWidth: item.barWidth ?? 12, 
            itemStyle: {
                borderWidth: 2,
                borderRadius: item.itemStyle?.borderRadius ?? 12,
                ...item.itemStyle, 
            },
            tooltip: item.tooltip,
            yAxisIndex: yAxisIndex,
        };
    });
}