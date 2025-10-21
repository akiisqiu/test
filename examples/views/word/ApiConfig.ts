export const wordList = [
    {
        name: "title",
        path: 'title',
        type: "string",
        content:'标题文本',
    },
    {
        name: "colors",
        path: 'colors',
        type: "array",
        content:'图例及图表颜色配置，按顺序选择，长度不足循环展示，可被itemStyle样式覆盖'
    },
    {
        name: "x",
        path: 'x',
        type: "array",
        content:'纵向图中为x轴数据'
    },
    {
        name: "y",
        path: 'y',
        type: "array",
        content:'seires配置项',
        children:[
            {
                name: "type",
                path: 'y/type',
                type: "line' | 'bar' | 'stackBar",
                content:'目前支持三种配置'
            },
            {
                name: "name",
                path: 'name/type',
                type: "string",
                content:'数据名称'
            },
        ]
    },
]
