const span = document.createElement('span')
span.style.visibility = "hidden";
span.style.position = "absolute";
span.style.whiteSpace = "no-wrap";
span.style.fontFamily = "normal";
span.style.position = "fixed";
span.style.left = "-10000vw";
span.style.zIndex = "-10";
span.id='getTextWidthDomCanNotChangeOrRemove'
document.documentElement.appendChild(span)


export function getTextWidth(text: string = '', fz: string = '', fw: string = '') {
  if (!text) return 0
  span.innerText = text;
  span.style.fontSize = fz;
  span.style.fontWeight = fw;
  const width = span.offsetWidth;
  return Math.ceil(width);
}
