## createGraphicsを使ってレイヤー化したい
https://p5js.org/reference/#/p5/createGraphics

```js
let pg;
function setup() {
  createCanvas(100, 100);
  pg = createGraphics(100, 100);
}

function draw() {
  background(200);
  pg.background(100);
  pg.noStroke();
  pg.ellipse(pg.width / 2, pg.height / 2, 50, 50);
  image(pg, 50, 50);
  image(pg, 0, 0, 50, 50);
}
```

Creates and returns a new p5.Renderer object. Use this class if you need to draw into an off-screen graphics buffer.

Syntax
`createGraphics(w, h, [renderer])`

renderer Constant: either P2D or WEBGL undefined defaults to p2d (Optional)

p5.Graphics objectについて
Methods
`reset()`
Resets certain values such as those modified by functions in the Transform category and in the Lights category that are not automatically reset with graphics buffer objects. Calling this in draw() will copy the behavior of the standard canvas.
`remove()`
Removes a Graphics object from the page and frees any resources associated with it.

## レイヤー化で試したいこと
createGraphicsで作成したレイヤーでアニメーションを動かし、draw内でimageで貼り付けることでアニメーションを作成できるか確認する。レイヤーを複数作成する。

## 構成
画面を上下に分割する2つのp5.Graphics作成する。


## レイヤー1
それぞれのp5.Graphicsに短冊を横に並べる。短冊は左からグラデーションとらなるようにする。

### グラデーション
HSBを利用する。
https://tomari.org/main/java/color/hsb.html
H（色相）は、360°の円周に色を配置します。
赤（0°）、黄（60°）、緑（120°）、シアン（180°）、青（240）、マゼンタ（300°）の順で、360°では再び赤に戻ります。
実際には角度でなく、円周を0.0から1.0で表わすのが一般的です。
S（彩度）とV（明度）は、R、G、B値の最大をMAX、最小をMINとしたとき、S＝(MAX - MIN) / MAXおよびV＝MAX / 255で表わされます。
p5.GraphicsのindexでHを決定して、短冊のindexでSとHを決定する。

## レイヤー2
短冊の移動に連動してボールが跳ねるようにする。
x軸方向は等速直線運動
y軸方向は、弾性運動にする。

## 考え中
レイヤー1が上下それぞれで重複されて、blendModeを選択する。
レイヤー2のボールの周囲にeraseで短冊に影響する。→noBackgroundでblendする？

## to do
2つのレイヤーでずらすなど差をつける。→ 2つめのレイヤーの高さを半分にしては？
alphaをsinで変化させる。
imageをテクスチャとして貼り付けられる？
texture使えばできそう。

https://p5js.org/reference/#/p5/texture
