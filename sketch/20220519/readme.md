## 概要
generative design
→P 2_1_3_01
グリッドを埋めているモジュールは、積み重なった円でできています。この円は、 ランダムに決まる上下左右のいずれかの方向に向かって段々小さくなっていきます。円の数はマウスのx座標に、 円の動きはマウスのy座標に対応しています。

## 実装
x座標に応じた個数の円を生成する。
円の中心の最大のずれはy座標による。円のindexにより、ずれ0から最大のずれまで変化させる。中心を徐々にずらす。
半径は、中心から近いグリッド境界までの距離とする。
中心がずれる向き(上、右、左、下)は初期化時に固定する。

## 回転の方向
currentAngleからtargetAngleがpiを超える場合は回転の方向を逆にしたい。
rotateDirectionパラメーターを追加して、targetAngle更新時に更新する。
rotateDirectionによりangleを更新する関数を変える。

diffがpiを超えない場合

```js
const diff = targetAngle - currentAngle;
const progress = diff * easingF;
return currentAngle + progress;
```

diffがpiを超える場合

```js
const diff = - (targetAngle - currentAngle);
const progress = diff * easingF;
return currentAngle + progress;
```