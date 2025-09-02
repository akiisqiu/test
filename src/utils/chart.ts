import { intervalScaleNiceTicks } from 'echarts/lib/scale/helper.js';
interface optionType {
    size: number,
    family: string
}
const family = 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif';
const fontSize = 16;
/**
 * 三位一个逗号
 * @param data
 * @param decimalPlaces
 * @returns {string}
 */
// 定义一个函数，用于格式化数字
const formatNumber = (data: any, decimalPlaces: number) => {
    // 如果数字为0，则直接返回0
    if (data == 0) {
        return 0;
    } else {
        // 将数字转换为字符串，并保留指定的小数位数，然后以小数点分割成整数部分和小数部分
        const [integerPart, decimalPart] = Number(data)
            .toFixed(decimalPlaces)
            .split('.');
        // 将整数部分每三位添加一个逗号
        const formattedIntegerPart = integerPart.replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ','
        );
        // 如果有小数部分，则添加小数点和小数部分，否则只返回整数部分
        const formattedDecimalPart = decimalPart ? '.' + decimalPart : '';
        // 返回格式化后的数字
        return formattedIntegerPart + formattedDecimalPart;
    }
}
/**
 * 获取chart 中文本的宽度
 * @param text 文本
 * @param {*} options 文字样式
 * @returns {number}
 * */
// 定义一个函数，用于获取字符串的实际宽度
const getActualWidthOfChars = (text: string, options: optionType = { size: fontSize, family: family }) => {
    // 从options中获取字体大小和字体类型，如果没有传入，则使用默认值
    const { size = 16, family = 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' } = options;
    // 创建一个canvas元素
    let canvas: HTMLCanvasElement = document.createElement('canvas');
    // 获取canvas的上下文
    const ctx = canvas.getContext('2d');
    // 如果上下文存在
    if (ctx) {
        // 设置字体大小和字体类型
        ctx.font = `${size}px ${family}`;
        // 获取字符串的度量信息
        const metrics = ctx.measureText(text);
        // 计算字符串的实际宽度
        const actual = Math.abs(metrics.actualBoundingBoxLeft) + Math.abs(metrics.actualBoundingBoxRight);
        // canvas = null;
        // 返回字符串的最大宽度
        return Math.max(metrics.width, actual)
    }
}
/**
 * 获取chart 图表 y轴数字 最长文本宽度
 * @param {*} extend 数据的范围
 * @param {*} option 文字样式
 * @returns {number}
 */
// 定义一个函数，用于获取最大宽度
const getMaxWidth = (extend: any, option: optionType = { size: fontSize, family: family }) => {
    // 定义一个变量，用于存储最大宽度
    let LMaxWidth = 0;
    // 调用intervalScaleNiceTicks函数，获取刻度范围和间隔
    const lTick = intervalScaleNiceTicks(extend, 5);
    // 如果刻度范围的最小值小于0，则将最小值减去间隔
    const min = lTick.niceTickExtent[0] < 0 ? lTick.niceTickExtent[0] - lTick.interval : lTick.niceTickExtent[0];
    // 将刻度范围的最大值加上间隔
    const max = lTick.niceTickExtent[1] + lTick.interval;
    // 定义一个变量，用于存储最大长度值
    let MaxLengthValue = 0
    // 遍历刻度范围，获取每个刻度的长度，并更新最大长度值
    for (let i = min; i <= max; i += lTick.interval) {
        const len = i.toString().length
        MaxLengthValue = len < MaxLengthValue.toString().length ? MaxLengthValue : i
    }
    // 调用getActualWidthOfChars函数，获取最大长度值的实际宽度
    LMaxWidth = getActualWidthOfChars(formatNumber(MaxLengthValue, 1).toString(), option) || 0;
    // 返回最大宽度
    return LMaxWidth;
}
/**
 * 防抖
 * @param fn 回调函数
 * @param delay 延迟时间
 */
const debounce = (fn: Function, delay: number) => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (...args: any[]) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(args);
        }, delay);
    };
};
export { getMaxWidth, getActualWidthOfChars, debounce }