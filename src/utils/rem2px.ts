const ui = 1080;
export default function remToPx(remValue: number) {
    const width = document.documentElement.clientHeight;
    return (remValue / ui) * width;

}
