export const optionStr = $ref({
tab1:`{
    title: "横向堆叠柱状图",
    y: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    x: [
        {
            name: "系列1",
            data: [10, 20, 30, 40, 50],
        },
        {
            name: "系列2",
            data: [20, 30, 40, 50, 60],
        },
        {
            name: "系列3",
            data: [30, 40, 50, 60,70],
        },
    ],
    units:'单位：个',
    xAxisLabel:true,
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
}`,
tab2:`{
    title: "依据百分比的横向堆叠柱状图",
    y: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    x: [
        {
            name: "系列1",
            data: [10, 20, 30, 40, 50],
        },
        {
            name: "系列2",
            data: [20, 30, 40, 50, 60],
        },
        {
            name: "系列3",
            data: [30, 40, 50, 60,70],
        },
    ],
    units:'单位：%',
    tooltip: {
        valueFormatter: (value) => value  + "%" 
    },
    percentage:true,
    colors: [
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(83, 201, 81, 0.40)" },
            { offset: 1, color: "rgba(87, 154, 56, 1)" },
        ]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(111, 189, 240, 0.40)" },
            { offset: 1, color: "rgba(103, 171, 217, 1)" },
        ]),
        new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: "rgba(231, 189, 125, 0.40)" },
            { offset: 1, color: "rgba(231, 189, 125, 1)" },
        ]),
        
    ]
}`,
tab3:`{ 
    title: "自定义横向堆叠柱状图",
    y: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    x: [
        {
            name: "运输设备",
            data: [1, 2, 3, 4, 5],
            //特殊样式
            itemStyle: {
                color: {                                    
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 1,
                    y2: 0,
                    //提示框颜色取itemStyle——colorStops中第一个color
                    colorStops: [
                        { "offset": 0, "color": "rgba(87,154,56,0.53)" },
                        { "offset": 1, "color": "rgba(83,201,81,0)" }
                    ]
                },
                shadowColor: "rgba(0, 0, 0, 0.3)",
                shadowBlur: 6
            },
        },
        {
            name: "采装设备",
            data: [5, 4, 3, 2, 1],
            //自定义borderRadius
            itemStyle: {
                borderRadius:[10,10,0,0],
            }
        },
        {
            name: "辅助设备",
            data: [1, 2, 3, 4, 5],
            //自定义提示框单位
            tooltip: {
                valueFormatter: function (value) {
                    return value + ' ml';
                }
            },
        }
    ],
    colors: [
        "rgba(87,154,56,0.53)",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
}`,
tab4:`{
    title: "自定义提示框",
    y: ["公司1", "公司2", "公司3"],
    x: [
        {
            name: "运输设备",
            data: [1, 2, 3, 4, 5],
        },
        {
            name: "采装设备",
            data: [5, 4, 3, 2, 1],
        },
        {
            name: "辅助设备",
            data: [1, 2, 3, 4, 5],
        }
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    tooltip: {
        //自定义提示框
        formatter: function (params) {
            const title = Array.isArray(params) && params[0]?.axisValueLabel ? params[0].axisValueLabel : '-';
            const content = params.map(p => { 
                const { seriesIndex,seriesName,value } = p;
                return \`<div>\${seriesName}: \${value}</div>\`;
            }).join('');
            return \`<div style="padding:5px; border:1px solid #ccc;">
                <div><strong>\${title}</strong></div>
                \${content}
            </div>\`;
        }
    }
}`
})