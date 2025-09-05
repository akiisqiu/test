// 设置 rem 函数
function setRem() {
    // 16:9     
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;

    let htmlHeight = document.documentElement.clientHeight || document.body.clientHeight;

    //得到html的Dom元素
    let htmlDom = document.getElementsByTagName('html')[0];

    //设置根元素字体大小
    let base = Math.min(htmlWidth / (1920 / 16), htmlHeight / (1080 / 16));
    htmlDom.style.fontSize = base + 'px';
}

setRem();
// 改变窗口大小时重新设置 rem
window.addEventListener('resize', function () {
    setRem();
});

const uiH = 1080;
const uiW = 1920;
export default function remToPx(remValue: unknown) {
    if (typeof remValue !== 'number') {
        return remValue
    }
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    let nowSize = Math.min(width /uiW, height / uiH);
    return remValue * nowSize;

}
