## 概要
nature of code 
Exercise 2.4
Create pockets of friction in a Processing sketch so that objects only experience friction when crossing over those pockets. What if you vary the strength (friction coefficient) of each area? What if you make some pockets feature the opposite of friction-i.e., when you enter a given pocket you actually speed up instead of slowing down?

画面の中央に水面があり、数字が上から落ちてきて、水面にぶつかると回転しながら沈む。
水面にぶつかった時の速度により、回転速度を決定する。

F = |v|^2 * cd * ^v* - 1
v: 速度の大きさ
cd: 摩擦係数、干渉係数
^v: 速度の単位ベクトル

## 実装
自由落下部分
https://www.mkbtm.jp/?p=1576
F = ma
v = gt
y = 1/2 * g * t^2
- m: フォントサイズ
- g: 重力（9.8）

## next
- [x]isResetを最後にもってくる。
- [x]判定にはpreIsResetを用いる。
- [x]initではisReset = trueとして、ほかの処理は書かない。
- [x]最初のループでisResetの処理を実行する。
- [ ]isRestを文字毎に設定するのではなく、すべての文字が沈んだ時を更新のタイミングとする。
- [ ]回転速度にvとmを反映させる。
- [ ]フォント変える