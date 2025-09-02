// 设置 rem 函数
function setRem() {
    // 16:9     
    let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;

    let htmlHeight = document.documentElement.clientHeight || document.body.clientHeight;

    //得到html的Dom元素
    let htmlDom = document.getElementsByTagName('html')[0];

    //设置根元素字体大小
    let base = htmlHeight / (1080 / 16)
    htmlDom.style.fontSize = base + 'px';
}

setRem();
// 改变窗口大小时重新设置 rem
window.addEventListener('resize', function () {
    setRem();
});

const ui = 1080;
export default function remToPx(remValue: number) {
    const width = document.documentElement.clientHeight;
    return (remValue / ui) * width;

}
