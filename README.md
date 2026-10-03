# Sashiko-Maker

Make a sashiko pattern right in your browser: the Japanese running stitch, white thread on indigo cloth, drawn as waves, leaves, shells and stars. Watch it being stitched one line at a time, change the stitches and the cloth, and save it as an SVG or a PNG. No sign-up and no libraries.

- [Stitch a pattern](https://evoluteur.github.io/sashiko-maker/)

[![Sashiko Maker](sashiko-maker.png)](https://evoluteur.github.io/sashiko-maker/)

## What it does

Sashiko (“little stabs”) began in the farming and fishing villages of northern Japan, where layers of worn indigo cotton were stitched together with white thread to make them warmer and last longer.

- **Patterns**: seigaiha (blue ocean waves), asanoha (hemp leaf), shippō (seven treasures), kikkō (tortoise shell), yamagata (mountains), higaki (cypress fence), kagome (basket weave) and hitomezashi (one-stitch, a new random one every time), each with its meaning.
- **Stitch it**: watch the pattern being stitched pass by pass (all the lines one way, then the next way), as it is done by hand.
- **Stitches**: stitch length, the gap where the thread runs under the cloth, thread thickness, and a slightly uneven hand-stitched look.
- **Cloth**: indigo, deep indigo, red thread, undyed cotton, persimmon or sumi black, with chalk guide lines and a weave texture.
- **Save**: **Download PNG** (2000 pixels square) or **Download SVG**. The address of the page keeps the design, to share it.

## Patterns

Click a pattern to open it in the app.

<table>
<tr><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=seigaiha&u=72&s=9&g=55&c=indigo"><img src="img/seigaiha.png" width="200" alt="Seigaiha sashiko pattern"></a><br><b>Seigaiha</b> 青海波<br>Blue ocean waves</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=asanoha&u=72&s=9&g=55&c=indigo"><img src="img/asanoha.png" width="200" alt="Asanoha sashiko pattern"></a><br><b>Asanoha</b> 麻の葉<br>Hemp leaf</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=shippo&u=72&s=9&g=55&c=indigo"><img src="img/shippo.png" width="200" alt="Shippō sashiko pattern"></a><br><b>Shippō</b> 七宝<br>Seven treasures</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=kikko&u=72&s=9&g=55&c=indigo"><img src="img/kikko.png" width="200" alt="Kikkō sashiko pattern"></a><br><b>Kikkō</b> 亀甲<br>Tortoise shell</td></tr>
<tr><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=yamagata&u=72&s=9&g=55&c=indigo"><img src="img/yamagata.png" width="200" alt="Yamagata sashiko pattern"></a><br><b>Yamagata</b> 山形<br>Mountains</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=higaki&u=72&s=9&g=55&c=indigo"><img src="img/higaki.png" width="200" alt="Higaki sashiko pattern"></a><br><b>Higaki</b> 檜垣<br>Cypress fence</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=kagome&u=72&s=9&g=55&c=indigo"><img src="img/kagome.png" width="200" alt="Kagome sashiko pattern"></a><br><b>Kagome</b> 籠目<br>Basket weave</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=hitomezashi&u=72&s=9&g=55&c=indigo&seed=7"><img src="img/hitomezashi.png" width="200" alt="Hitomezashi sashiko pattern"></a><br><b>Hitomezashi</b> 一目刺し<br>One-stitch</td></tr>
</table>

## How it works

Every pattern is a set of lines (straight, zigzag or curved) grouped in passes. The seigaiha fans are circles hidden wherever a fan of the next row covers them; shippō is made of waves of quarter circles; asanoha is a triangle grid with three spokes in every triangle, chained into zigzags. Each line is then cut into running stitches fitted to every straight run, so a stitch always ends right on a corner. In hitomezashi every stitch is one square long, and each row and column starts on a stitch or a gap at random.

## How it is built

Plain HTML, CSS and JavaScript, with no dependencies and no build step. Just open `index.html`. It is also a small installable web app that works offline.

- The whole thing is in `js/sashiko.js` ([source](https://github.com/evoluteur/sashiko-maker/blob/main/js/sashiko.js)).
- The three color themes (dark, light and blue) are shared with my other projects, copied from [omg-themes](https://github.com/evoluteur/omg-themes) (`npm run sync:themes` refreshes them).

Sashiko-Maker is open source at [GitHub](https://github.com/evoluteur/sashiko-maker) with MIT license.

Had fun browsing the app? [Buy me a coffee by becoming a sponsor](https://github.com/sponsors/evoluteur).

You may also be interested in [Kumiko-Maker](https://github.com/evoluteur/kumiko-maker) ([demo](https://evoluteur.github.io/kumiko-maker/)), [Kolam-Maker](https://github.com/evoluteur/kolam-maker) ([demo](https://evoluteur.github.io/kolam-maker/)) and [Celtic-Knot-Maker](https://github.com/evoluteur/celtic-knot-maker) ([demo](https://evoluteur.github.io/celtic-knot-maker/)). For more mystic arts as small web apps, see [Esoterica](https://evoluteur.github.io/esoterica.html).

Copyright (c) 2026 [Olivier Giulieri](https://evoluteur.github.io/).
