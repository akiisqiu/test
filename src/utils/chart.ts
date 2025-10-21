// 主动获取Y轴最大值的工具函数
export const getYAxisMax = async (chart:any,doubleY:Boolean)=>{
    if(!chart) return
    const formatter = function(value: number, max: number) {
        const v = Number(value); // 确保是数值

        if (v === 0) return '0';

        if (max >= 1e8) { 
            return (v / 1e8).toFixed(1).replace(/\.0$/, '') + '亿';
        } else if (max >= 1e4) {
            return (v / 1e4).toFixed(1).replace(/\.0$/, '') + '万';
        }

        return parseFloat(v.toFixed(2)); 
    };

    if(!doubleY){
        // 获取Y轴模型
        const yAxisModel = chart.getModel().getComponent('yAxis', 0);
        //  获取轴的范围（[min, max]），取第二个值为最大值
        const [_, max] = yAxisModel.axis.scale.getExtent();
        chart.setOption({
            yAxis: {
                axisLabel: { formatter: (value: number) => formatter(value, max)}
            }
        });
    } else {
        const yAxis0Model = chart.getModel().getComponent('yAxis', 0);
        const yAxis1Model = chart.getModel().getComponent('yAxis', 1);
        const [_, max0] = yAxis0Model.axis.scale.getExtent();
        const [__, max1] = yAxis1Model.axis.scale.getExtent();
        chart.setOption({
            yAxis: [
                { axisLabel: { formatter: (value: number) => formatter(value, max0) } }, // 第0个Y轴
                { axisLabel: { formatter: (value: number) => formatter(value, max1) } }  // 第1个Y轴
            ]
        });
    }
}