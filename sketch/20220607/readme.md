## 概要
nature of code 1.6
Use a custom probability distribution to vary the size of a step taken by the random walker. The step size can be determined by influencing the range of values picked. Can you map the probability exponentially-i.e. making the likelihood that a value is picked equal to the value squared?
独自の分布を用いてランダムウォークのステップのサイズを決定する。
ステップのサイズは選択される数値の範囲により決定される。
確率を対数にマップできるか？

```js
while (true) {
    const r1 = Math.random();
    const p = r1; // y = xの場合　指数関数の場合は p = Math.pos(r1, n);
    const r2 = Math.random();
    if (r2 < p) {
        return r1;
    } else {
        return false;
    }
}
```

## 実装
