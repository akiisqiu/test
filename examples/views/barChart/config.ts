export const optionStr = $ref({
tab1:`{
    title: "基础柱状图",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
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
            value: [1, 2, 3, 4, 5]
        }
    ],
    colors: [
        "#6EF366",
        "#6FBDF0",
        "rgba(255, 220, 128, 1)"
    ],
    units:["单位：h"]
}`,
tab2:`{
    title: "基础柱状图-自定义单个柱子颜色",
    x: ["公司1", "公司2", "公司3"],
    y: [
        {
            value: [
                {
                    value:1,
                    itemStyle: {
                        color: "#E7BD7D"
                    }
                },
                {
                    value:2,
                    itemStyle: {
                        "color": "#6EF366"
                    }
                },
                {
                    value:3,
                    itemStyle: {
                        "color": "#AB80FF"
                    }
                }, 
            ]
        }
    ],
    units:["单位：h"]
}`,
tab3:`{ 
    title: "基础柱状图-柱状图自定义",
    x: ["08-15", "08-16", "08-17", "08-18", "08-19"],
    y: [
        {
            label: "运输设备",
            value: [1, 2, 3, 4, 5],
            //特殊样式
            barWidth:20 ,
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
    units:["单位：h"]
}`,
tab4:`{
    title: "基础柱状图-带背景色的柱状图",
    x: ["公司1", "公司2", "公司3"],
    y: [
        {
            value: [1, 2, 3, 4, 5],
            //带背景色
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)',
                borderRadius:12
            },
        }
    ],
    units:["单位：h"]
}`,
tab5:`{
    title: "基础柱状图-自定义提示框",
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