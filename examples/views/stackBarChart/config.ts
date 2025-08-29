export const optionStr = $ref({
tab1:`{
    title: "堆叠柱状图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            label: "系列1",
            value: [10, 20, 30, 40, 50],
        },
        {
            label: "系列2",
            value: [20, 30, 40, 50, 60],
        },
    ],
    units:['单位：个'],
    colors: [
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
}`,
tab2:`{
    title: "依据百分比堆叠的柱状图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            label: "系列1",
            value: [10, 20, 30, 40, 50],
        },
        {
            label: "系列2",
            value: [20, 30, 40, 50, 60],
        },
        {
            label: "系列3",
            value: [30, 40, 50, 60,70],
        },
    ],
    units:['单位：%'],
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
    title: "自定义堆叠柱状图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            label: "运输设备",
            value: [1, 2, 3, 4, 5],
            //特殊样式
            itemStyle: {
                borderRadius:20,
                color: {                                    
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    //提示框颜色取itemStyle——colorStops中第一个color
                    colorStops: [
                        { "offset": 1, "color": "rgba(87,154,56,0.53)" },
                        { "offset": 0, "color": "rgba(83,201,81,0)" }
                    ]
                },
                shadowColor: "rgba(0, 0, 0, 0.3)",
                shadowBlur: 6
            },
        },
        {
            label: "采装设备",
            value: [5, 4, 3, 2, 1],
            //自定义borderRadius
            borderRadius:[10,10,0,0],
        },
        {
            label: "辅助设备",
            value: [1, 2, 3, 4, 5],
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
    x: ["公司1", "公司2", "公司3"],
    y: [
        {
            label: "运输设备",
            value: [1, 2, 3, 4, 5],
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