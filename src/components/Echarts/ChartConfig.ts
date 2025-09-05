import type { EChartsOption } from 'echarts';
import type { IExtendedYOption, IProps } from './Echarts.vue'; 
import type { YAXisOption } from 'echarts/types/dist/shared';

//基础Y轴
export const createBaseY = (): YAXisOption => ({
    type: 'value',
    axisLabel: {
        color: "#D2D2ED",
        fontSize: 12,
        showMinLabel:true,
        showMaxLabel:true,
        hideOverlap: true
    },
    splitLine: {
        lineStyle: {
            color: 'rgba(255,255,255,.04)'
        }
    },
    axisLine: {
    },
    axisTick: {
        show: false
    }
})

//配置柱状图
export const getBarSeries = (item: IExtendedYOption, idx: number, props: IProps): EChartsOption['series'] => {
    let yAxisIndex = 0
    // 双y轴
    if(props.doubleY){
        yAxisIndex = item.yAxisIndex ? item.yAxisIndex : (idx > 1 ? 1 : idx )
    }

    return {
        ...item,
        type: 'bar',
        data: item.data.length > 0 ? item.data : [0],
        color: props.colors && props.colors[idx % props.colors.length],
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
export const getLineSeries = (item: IExtendedYOption, idx: number,props: IProps): EChartsOption['series'] => {
    let yAxisIndex = 0
    // 双y轴
    if(props.doubleY){
        yAxisIndex = item.yAxisIndex ? item.yAxisIndex : (idx > 1 ? 1 : idx )
    }
    return {
        ...item,
        type: 'line',
        data: item.data.length > 0 ? item.data : [0],
        color: props.colors && props.colors[idx % props.colors.length],
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
export const getStackSeries = ( stackItems: IExtendedYOption[], props: IProps) => {
    const stackName = stackItems[0]?.stack || 'total';
    return stackItems.map((item) => {
        let yAxisIndex = 0
        // 双y轴
        if(props.doubleY &&item.index ){
            yAxisIndex = item.yAxisIndex ? item.yAxisIndex : ( item.index> 1 ? 1 : item.index )
        }
        return {
            ...item, 
            type: 'bar' , 
            stack: stackName, 
            data: item.data.length > 0 ? item.data : [0],
            color: props.colors &&item.index && props.colors[item.index % props.colors.length],
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