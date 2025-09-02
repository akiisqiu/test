import * as echarts from "echarts";
// 基础折线图配置
const tab1 = {
    title: "基础折线图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            label: "运输设备",
            value: [10, 21, 13, 24, 15],
        },
        {
            label: "采装设备",
            value: [5, 4, 3, 2, 1],
        },
        {
            label: "辅助设备",
            value: [1, 2, 3, 4, 5]
        }
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h"]
}


// 基础折线图-折线图自定义
const tab2 = {
    title: "基础折线图-折线图自定义",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            label: "运输设备",
            value: [10, 21, 13, 24, 15],
            //特殊样式
            lineStyle: {
                width:10 ,
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                        { offset: 0, color: "#87E6DE" },
                        { offset: 1, color: "#9CEA4E" }
                    ]
                },
                shadowColor: "rgba(0,0,0,0.54)",
                shadowBlur: 4,
                shadowOffsetY: 4
            },
        },
        {
            label: "采装设备",
            value: [5, 4, 3, 2, 1],
        },
        {
            label: "辅助设备",
            value: [1, 2, 3, 4, 5],
            areaStyle: {
                opacity: 0.8,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: "rgba(231, 189, 125,0.3)" },
                    { offset: 1, color: "rgba(24,84,98,0)" },
                ]),
            },
        }
    ],
    colors: [
        "#9CEA4E",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h"]
}

// 基础折线图-自定义提示框
const tab3 = {
    title: "基础折线图-自定义提示框",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            label: "运输设备",
            value: [10, 21, 13, 24, 15],
        },
        {
            label: "采装设备",
            value: [5, 4, 3, 2, 1],
        },
        {
            label: "辅助设备",
            value: [1, 2, 3, 4, 5],
        }
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    tooltip: {
        //自定义提示框
        formatter: (params: any[]) => {
            const title = Array.isArray(params) && params[0]?.axisValueLabel ? params[0].axisValueLabel : '-';
            const content = params.map(p => { 
                const { seriesName,value } = p;
                return `<div>${seriesName}: ${value}</div>`;
            }).join('');
            return (
                `<div style="padding:5px; border:1px solid #ccc;">
                    <div><strong>${title}</strong></div>
                    ${content}
                </div>`
            );
        }
    }
}

// 基础折线图-双轴
const tab4 = {
    title: "基础折线图-双轴 ",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            label: "运输设备",
            value: [10000000000000000000, 21, 13, 24, 15],
        },
        {
            label: "采装设备",
            value: [14, 11, 16, 12, 25],
        },
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h",'单位：t'],
    doubleY:true,
    boundaryGap:false
}
export default {
    tab1,
    tab2,
    tab3,
    tab4,
}
