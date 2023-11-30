
export function draw() {
  var canvas = document.getElementById("canvas");
  canvas.style.top = '50px';
  canvas.style.right = '0px';
  var ctx = canvas.getContext("2d");
  var str = "当内容特别多的时候，canvas不会自动换行，需要特别处理当内容特别多的时候，canvas不会自动换行，需要特别处理当内容特别多的时候，canvas不会自动换行，需要特别处理当内容特别多的时候，canvas不会自动换行，需要特别处理";
  var canvasWidth = '300';
  canvas.fillStyle = '#00f'
  ctx.font = "16px Microsoft";
  canvas.height = Math.ceil(ctx.measureText(str).width / canvasWidth) * 26;
  ctx.font = "14px Microsoft"; //重新定义画布的高度后，需要重新定义字体的大小，否则变成默认值
  var initHeight = 25; //绘制字体距离canvas顶部初始的高度
  var lastSunStrIndex = 0; //每次开始截取的字符串的索引
  var contentWidth = 0;
  if (ctx.measureText(str).width <= canvasWidth) {
    ctx.fillText(str, 0, initHeight);
    return
  }

  for (let i = 0; i < str.length; i++) {
    contentWidth += ctx.measureText(str[i]).width;
    if (contentWidth > canvasWidth - 32) {
      ctx.fillText(str.substring(lastSunStrIndex, i), 12, initHeight) //绘制未截取的部分
      initHeight += 25;
      contentWidth = 0;
      lastSunStrIndex = i;
    }
    if (i == str.length - 1) {
      ctx.fillText(str.substring(lastSunStrIndex, i + 1), 12, initHeight);
    }
  }
}