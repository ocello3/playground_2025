# overview
ツール
peakDetectで指定する周波数と他のパラメータを決めるために使う

# todo
peakDetectとかを組み合わせる

# log
## p5.FFT の周波数ビン（配列 1024 個）が表す周波数の計算方法
### 背景
`let spectrum = fft.analyze();`の配列の中身を確認する -> 各要素に数値が入っているだけ。要素番号と周波数の関係が知りたい。配列数は1024。最低周波数と最高周波数が分かれば、要素ごとの周波数の感覚がわかる。 -> 仕様書か何かを探す
## 調査
表示範囲のminとmaxを設定したい
paramsに追加したので、計算に組み込む

fftSize = ビン数（配列の数） × 2
周波数分解能（1 ビンあたりの周波数幅）= sampleRate / fftSize
任意のビン番号から周波数を計算する公式は freq = binIndex * (sampleRate / fftSize)
最大周波数 = sampleRate / 2 = Nyquist周波数
周波数からビン数を計算する方法 binIndex = floor( frequency / (sampleRate / fftSize) )


fftしたデータを2次元でリアルタイムに表示
peakDetectされた時に、色を変える
peakDetectしている周波数帯の範囲は色を変える
3dでの表示を確認する
フレームごとのfftデータを配列に格納する

まずは再生する

横に拡大できるように、表示する最低周波数と最高周波数をスライダーで指定できるようにする
スライダーを動かしたらp.isMovedをtrueにする
draw()の最後でp.isMovedをfalseにする
minFreqとmaxFreqの範囲を指定する。minは0だけど、maxは計算する必要がある → とりあえず22000にした
paneは設定できたはず

エラーは出てないけど、fftの音量が全部の配列で一定で、scaleの数字も全部同じになってしまってる
-> カッコの修正でたぶん直った
minがmaxを超えないようにする clamp ? ok
bin.detectMin, bin.detectMax, bin.detectCountを追加したので、それを使って最低周波数と最高周波数の範囲の色を変える
ここから: p.isDetectでalphaを計算する。peak検出時に色を変えてるけど、一瞬だから徐々に消えるようにする
detectの範囲が表示エリアを超えたら表示エリアも自動的に広がって欲しい
# later


