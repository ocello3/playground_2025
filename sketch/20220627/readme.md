## 概要
nature of code 
Create a simulation of a vehicle that you can drive around the screen using the arrowkeys: left arrow accelerates the car to the left, right to the right. The car should pointin the direction in which it is currently moving.

角度は`atan(vel_y/vel_x)`で求められる。
```js
push();
translate();
rotate(angle);
rect();
pop();
```
targetAngleをマウスのpositionから計算する。
現在のangleからeasingで角度を変化させる。
easingFは矢印毎に異なる。

## 実装

## next
マウスの位置を使ってもあまり面白くないので、8の字などを自由に動けるようにして、マウスの位置が変化したらそこに追従するようにする。
