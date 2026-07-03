let backgroud = "#495a55";
let color_palette_layer1 = ["#a2c5c5", "#a5e9f3", "#78bed8"];
let color_palette_layer1_2 = ["#00c6c6", "#00ddff", "#098dbd"];
let color_palette_layer2;
let color_palette_layer3 = ["#dbf2ecc7"]; // 8a360b
let color_palette_layer3_2 = ["#495a55"]; // 8a360b
let padding = 300;
// #b2440e
// init
async function setup() {
  colorMode(HSB); // NOTE 預設為RGB，加上才能用HSB模式
  createCanvas(2000, 1400); // 畫布大小：width, height
  background(backgroud); // 背景顏色

  color_palette_layer2 = ["#c8c52d", "#ffd220", "#d64929"];
  color_palette_layer2_2 = ["#ffd220", "#d64929", "#098dbd"];

  /** 使用迴圈繪製 - 底色層 */
  let xSum1 = 0;
  for (let i = 0; i < 300; i++) {
    let x = xSum1;
    let y = 0;
    let xCount = 20;
    let yCount = 350;
    let R = 4;
    let xSpan = R + random(1, 3);
    let ySpan = R + random(3);

    RJ_rect(
      "layer1",
      x,
      y,
      xCount,
      yCount,
      xSpan,
      ySpan,
      R,
      color_palette_layer1,
    );
    xSum1 += xCount * xSpan;
  }

  // let xSum2 = 0;
  // let ySum2 = 0;
  /** 中間層 - 每排越來越高 */
  for (let i = 0; i < 300; i++) {
    let x = random(-padding, width);
    let y = random(-padding, height);
    //
    // let x = 0;
    // let y = 0;
    // x += xSum2;
    // y = ySum2;
    let xCount = int(random(10, 60));
    let yCount = int(random(20, 100));
    let R = 4;
    let xSpan = R + random(0, 1);
    let ySpan = R + random(0, 1);

    RJ_organic_rect(
      "layer2",
      x,
      y,
      xCount,
      yCount,
      xSpan,
      ySpan,
      R,
      color_palette_layer2_2,
    );

    // /** 累加層數、層高 */
    // xSum2 = xSum2 + xCount * 4;
    // if (xSum2 > width) {
    //   ySum2 = ySum2 + yCount * ySpan;
    //   yCount += int(random(0, 80));
    //   xSum2 = 0;
    // }
  }

  /** 使用迴圈重複繪製 - 點綴層 */
  for (let i = 0; i < 5; i++) {
    let x = random(-padding, width);
    let y = random(-padding, height);
    let xCount = int(random(100, 200));
    let yCount = int(random(40, 80));
    let R = 6;
    let xSpan = R - random(2, 5);
    let ySpan = R - random(3);
    RJ_rect(
      "layer3",
      x,
      y,
      xCount,
      yCount,
      xSpan,
      ySpan,
      R,
      color_palette_layer3_1,
    );
  }

  noLoop(); // 只畫一次
}

function draw() {}

// _x: 起始x座標, _y: 起始y座標, _xCount: x方向點點排數, _yCount: y方向點點排數, _xSpan: x方向間距, _ySpan: y方向間距, _R: 點點大小
function RJ_rect(layer, _x, _y, _xCount, _yCount, _xSpan, _ySpan, _R, palette) {
  let mainClr = random(palette);
  let fade_scale = random(); // 0-1
  let isLayer1 = layer === "layer1";
  let isLayer2 = layer === "layer2";
  let isLayer3 = layer === "layer3";

  /** 光影變化 */
  let mainHue = hue(mainClr);
  let mainSat = saturation(mainClr);
  let mainBri = brightness(mainClr);
  let lighterMainClr = color(mainHue, mainSat, mainBri + 5);
  let randomDirection = random();

  // 繪製點點矩陣
  for (let i = 0; i < _xCount; i++) {
    for (let j = 0; j < _yCount; j++) {
      let randomMainClr = random(palette);

      let px = i * _xSpan + _x; // 計算 x 座標
      let py = j * _ySpan + _y; // 計算 y 座標

      fade_rate = !isLayer1 ? abs(j / _yCount - 0.5) * 2 : j / _yCount;
      fade_rate = map(fade_rate, 0, 1, 0, fade_scale);

      if (random() > fade_rate) {
        push(); // 儲存畫布目前狀態
        translate(px, py); // 移動畫布原點

        // /** 光影變化 */
        // let lightDirection = randomDirection > 0.5 ? px : py;
        // fill(
        //   abs(sin(lightDirection / 10)) < 0.8 && !isLayer3
        //     ? lighterMainClr
        //     : mainClr,
        // );

        fill(mainClr); // 填色
        noStroke();
        // isLayer1 && stroke(backgroud);
        let r = _R * random(0.5, 1.5);
        circle(0, 0, r);

        if (random() < 0.01) {
          noFill();
          stroke(lighterMainClr);
          strokeWeight(5);
          line(-r, -r, r, r);
          line(-r, r, r, -r);
        }

        pop(); // 回復至畫布先前狀態
      }
    }
  }
}

// 有機版 RJ_rect：用 Perlin noise 讓點點位置偏移、邊緣不規則
function RJ_organic_rect(
  layer,
  _x,
  _y,
  _xCount,
  _yCount,
  _xSpan,
  _ySpan,
  _R,
  palette,
) {
  let mainClr = random(palette);
  let fade_scale = random();
  let isLayer1 = layer === "layer1";
  let isLayer3 = layer === "layer3";

  let mainHue = hue(mainClr);
  let mainSat = saturation(mainClr);
  let mainBri = brightness(mainClr);
  let lighterMainClr = color(mainHue, mainSat, mainBri + 10);
  let randomDirection = random();

  let ns = random(0.04, 0.1); // noise 頻率：控制波動的「粗細」
  let noiseAmp = _xSpan * random(1, 2.5); // 位置偏移幅度
  let nOff = random(1000); // 每次呼叫用不同 noise 起點
  let edgeSoftness = random(0.15, 0.4); // 邊緣消退深度（0 = 仍是矩形，1 = 非常有機）

  for (let i = 0; i < _xCount; i++) {
    for (let j = 0; j < _yCount; j++) {
      // 計算距矩形四邊的歸一化距離（0 = 邊緣，1 = 中心）
      let ni = min(i, _xCount - 1 - i) / (_xCount / 2);
      let nj = min(j, _yCount - 1 - j) / (_yCount / 2);
      let edgeDist = min(ni, nj);

      // 用 noise 決定邊緣是否保留這個點 → 讓輪廓不規則
      let boundaryNoise = noise(i * ns + nOff, j * ns + nOff + 50);
      if (edgeDist < boundaryNoise * edgeSoftness) continue;

      // 用 noise 偏移每個點的位置 → 讓內部網格看起來像織物
      let dx = (noise(i * ns, j * ns, nOff) - 0.5) * noiseAmp;
      let dy = (noise(i * ns + 100, j * ns + 100, nOff) - 0.5) * noiseAmp;

      let px = i * _xSpan + _x + dx;
      let py = j * _ySpan + _y + dy;

      let fade_rate = abs(j / _yCount - 0.5) * 2;
      fade_rate = map(fade_rate, 0, 1, 0, fade_scale);

      if (random() > fade_rate + 0.2) {
        push();
        translate(px, py);

        let lightDirection = randomDirection > 0.5 ? px : py;
        // fill(
        //   abs(sin(lightDirection / 10)) < 0.8 && !isLayer3
        //     ? lighterMainClr
        //     : mainClr,
        // );
        fill(mainClr);

        noStroke();
        isLayer1 && stroke(backgroud);
        let r = _R * random(0.5, 1.5);
        circle(0, 0, r);

        if (random() < 0.01) {
          noFill();
          stroke(mainClr);
          strokeWeight(2);
          line(-r, -r, r, r);
          line(-r, r, r, -r);
        }

        pop();
      }
    }
  }
}

function drawBlobCircle(x, y, r) {
  let noiseOffset = random(1000); // 每個圓有不同的 noise 起點
  beginShape();
  for (let a = 0; a < TWO_PI; a += 0.2) {
    let n = noise(cos(a) + noiseOffset, sin(a) + noiseOffset);
    let rr = map(n, 0, 1, r * 0.7, r * 1.3); // 半徑隨 noise 浮動
    vertex(x + cos(a) * rr, y + sin(a) * rr);
  }
  endShape(CLOSE);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
