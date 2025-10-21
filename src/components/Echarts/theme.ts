import * as echarts from 'echarts'
echarts.registerTheme('dark', {
    "color": [
        "#5470c6",
        "#91cc75",
        "#fac858",
        "#d4a4eb",
        "#72ccff",
    ],
    //整体背景色
    "backgroundColor": "rgba(255,255,255,0)",
    "textStyle": {},
    "categoryAxis": {
        "axisLine": {
            "show": false,
        },
        "axisTick": {
            "show": false
        },
        "axisLabel": {
            "show": true,
            "color": "#D2D2ED",
        },
        "splitLine": {
            "show": false,
        },
    },
    "valueAxis": {
        "axisLine": {
            "show": false,
        },
        "axisTick": {
            "show": false,
        },
        "axisLabel": {
            "show": true,
            "color": "#d2d2ed"
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                color: "rgb(255, 255, 255,0.1)",
            }
        },
    },
    "tooltip": {
        trigger: "axis",
        "axisPointer": {
            type: "shadow",
            shadowStyle: {
                color: "rgb(255, 255, 255,0.1)",
            }
        },
        appendTo:'body',
        backgroundColor: "rgba(0,0,0, .6)",
        borderColor: "rgba(0,0,0)",
        textStyle: {
            color: "#fff",
        },
        extraCssText:'  backdrop-filter: blur(8px); '
    },
    "dataZoom": {
        "backgroundColor": "rgba(20,27,34,0.3)",
        "fillerColor":new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: "#9DF5E2" },
            { offset: 1, color: "#70A8F5" },
        ]),
        borderRadius:0,
        borderColor: '#4F637D',
        textStyle: {
            color: 'transparent',
        },
        // 选中部分数据阴影的样式
        selectedDataBackground:{
            lineStyle: {
                color: '#64b7f8'
            }
        },
        dataBackground: {
            // 背景边框颜色。
            lineStyle: {
                color: 'transparent',
                shadowOffsetY: 30,
            },
            areaStyle:{
                color:"#2b3544"
            }
        },
        moveHandleSize:0,
    },
});
echarts.registerTheme('white', {
    "color": [
        "#5ab1ef",
        "#c4ebad",
        "#ebdba4",
        "#edafda",
        "#afe8ff",
    ],
    //整体背景色
    "backgroundColor": "rgba(255,255,255,0)",
    "textStyle": {},
    "categoryAxis": {
        "axisLine": {
            "show": false,
        },
        "axisTick": {
            "show": false
        },
        "axisLabel": {
            "show": true,
            "color": "#303133",
        },
        "splitLine": {
            "show": false,
        },
    },
    "valueAxis": {
        "axisLine": {
            "show": false,
        },
        "axisTick": {
            "show": false,
        },
        "axisLabel": {
            "show": true,
            "color": "#303133"
        },
        "splitLine": {
            "show": true,
            "lineStyle": {
                "color":  "rgba(0,0,0,0.04)"
            }
        },
    },
    "tooltip": {
        trigger: "axis",
        "axisPointer": {
            type: "shadow",
            shadowStyle: {
                color: "rgba(0,0,0,0.05)",
            }
        },
        appendTo:'body',
        backgroundColor: "rgba(255,255,255, .6)",
        borderColor: "rgba(255,255,255)",
        textStyle: {
            color: "#303133",
        },
        extraCssText:'  backdrop-filter: blur(8px);'
    },
    "dataZoom": {
        "backgroundColor": "rgba(255,255,255,0.3)",
        "fillerColor":new echarts.graphic.LinearGradient(1, 0, 0, 0, [
            { offset: 0, color: "#9DF5E2" },
            { offset: 1, color: "#70A8F5" },
        ]),
        borderRadius:0,
        borderColor: '#4F637D',
        textStyle: {
            color: 'transparent',
        },
        // 选中部分数据阴影的样式
        selectedDataBackground:{
            lineStyle: {
                color: '#64b7f8'
            }
        },
        dataBackground: {
            // 背景边框颜色。
            lineStyle: {
                color: 'transparent',
                shadowOffsetY: 30,
            },
            areaStyle:{
                color:"#2b3544"
            }
        },
        moveHandleSize:0,
    },
});
