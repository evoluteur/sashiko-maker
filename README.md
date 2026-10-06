# Sashiko-Maker

Make a sashiko pattern right in your browser: the Japanese running stitch, white thread on indigo cloth, drawn as waves, leaves, shells and stars. Watch it being stitched one line at a time, change the stitches and the cloth, and save it as an SVG or a PNG. No sign-up and no libraries.

- [Stitch a pattern](https://evoluteur.github.io/sashiko-maker/)

[![Sashiko Maker](sashiko-maker.png)](https://evoluteur.github.io/sashiko-maker/)

## What it does

Sashiko (“little stabs”) began in the farming and fishing villages of northern Japan, where layers of worn indigo cotton were stitched together with white thread to make them warmer and last longer.

- **Patterns**: seigaiha (blue ocean waves), asanoha (hemp leaf), shippō (seven treasures), kikkō (tortoise shell), yamagata (mountains), higaki (cypress fence), kagome (basket weave), sayagata (key fret), tatewaku (rising steam), hitomezashi (one-stitch, a new regular pattern every time) and kaki-no-hana (persimmon flower), each with its meaning.
- **Stitch it**: watch the pattern being stitched pass by pass (all the lines one way, then the next way), as it is done by hand.
- **Stitches**: stitch length, the gap where the thread runs under the cloth, thread thickness, and a slightly uneven hand-stitched look.
- **Cloth**: indigo, deep indigo, red thread, undyed cotton, persimmon or sumi black, with chalk guide lines and a weave texture.
- **Save**: **Download PNG** (2000 pixels square) or **Download SVG**. The address of the page keeps the design, to share it.

## Patterns

Click a pattern to open it in the app.

<table>
<tr valign="top"><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=seigaiha&u=72&s=9&g=55&c=indigo"><img src="img/seigaiha.png" width="200" alt="Seigaiha sashiko pattern"></a><br><b>Seigaiha</b><br>青海波<br>Blue ocean waves</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=asanoha&u=72&s=9&g=55&c=indigo"><img src="img/asanoha.png" width="200" alt="Asanoha sashiko pattern"></a><br><b>Asanoha</b><br>麻の葉<br>Hemp leaf</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=shippo&u=72&s=9&g=55&c=indigo"><img src="img/shippo.png" width="200" alt="Shippō sashiko pattern"></a><br><b>Shippō</b><br>七宝<br>Seven treasures</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=kikko&u=72&s=9&g=55&c=indigo"><img src="img/kikko.png" width="200" alt="Kikkō sashiko pattern"></a><br><b>Kikkō</b><br>亀甲<br>Tortoise shell</td></tr>
<tr valign="top"><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=yamagata&u=72&s=9&g=55&c=indigo"><img src="img/yamagata.png" width="200" alt="Yamagata sashiko pattern"></a><br><b>Yamagata</b><br>山形<br>Mountains</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=higaki&u=72&s=9&g=55&c=indigo"><img src="img/higaki.png" width="200" alt="Higaki sashiko pattern"></a><br><b>Higaki</b><br>檜垣<br>Cypress fence</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=kagome&u=72&s=9&g=55&c=indigo"><img src="img/kagome.png" width="200" alt="Kagome sashiko pattern"></a><br><b>Kagome</b><br>籠目<br>Basket weave</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=sayagata&u=72&s=9&g=55&c=indigo"><img src="img/sayagata.png" width="200" alt="Sayagata sashiko pattern"></a><br><b>Sayagata</b><br>紗綾形<br>Key fret</td></tr>
<tr valign="top"><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=tatewaku&u=72&s=9&g=55&c=indigo"><img src="img/tatewaku.png" width="200" alt="Tatewaku sashiko pattern"></a><br><b>Tatewaku</b><br>立涌<br>Rising steam</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=hitomezashi&u=72&s=9&g=55&c=indigo&seed=9"><img src="img/hitomezashi.png" width="200" alt="Hitomezashi sashiko pattern"></a><br><b>Hitomezashi</b><br>一目刺し<br>One-stitch</td><td align="center"><a href="https://evoluteur.github.io/sashiko-maker/#p=kakinohana&u=72&s=9&g=55&c=indigo"><img src="img/kakinohana.png" width="200" alt="Kaki-no-hana sashiko pattern"></a><br><b>Kaki-no-hana</b><br>柿の花<br>Persimmon flower</td><td></td></tr>
</table>

## How it works

Every pattern is a set of lines (straight, zigzag or curved) grouped in passes. The seigaiha fans are circles hidden wherever a fan of the next row covers them; shippō is made of waves of quarter circles; asanoha is a triangle grid with three spokes in every triangle, chained into zigzags. Each line is then cut into running stitches fitted to every straight run, so a stitch always ends right on a corner. Sayagata is a grid of manji whose arms run on into long lines, drawn on the diagonal; tatewaku is pairs of waves in opposite phase. In hitomezashi every stitch is one square long, and each row and column starts on a stitch or a gap, following a short mirrored rhythm shared by rows and columns: a random one for hitomezashi, so every new pattern is regular and symmetric, or the fixed rhythm that makes kaki-no-hana.

## How it is built

Plain HTML, CSS and JavaScript, with no dependencies and no build step. Just open `index.html`. It is also a small installable web app that works offline.

- The whole thing is in `js/sashiko.js` ([source](https://github.com/evoluteur/sashiko-maker/blob/main/js/sashiko.js)).
- The three color themes (dark, light and blue) are shared with my other projects, copied from [omg-themes](https://github.com/evoluteur/omg-themes) (`npm run sync:themes` refreshes them).

Sashiko-Maker is open source at [GitHub](https://github.com/evoluteur/sashiko-maker) with MIT license.

Had fun browsing the app? [Buy me a coffee by becoming a sponsor](https://github.com/sponsors/evoluteur).

You may also be interested in [Kumiko-Maker](https://github.com/evoluteur/kumiko-maker) ([demo](https://evoluteur.github.io/kumiko-maker/)), [Kolam-Maker](https://github.com/evoluteur/kolam-maker) ([demo](https://evoluteur.github.io/kolam-maker/)) and [Celtic-Knot-Maker](https://github.com/evoluteur/celtic-knot-maker) ([demo](https://evoluteur.github.io/celtic-knot-maker/)). For more mystic arts as small web apps, see [Esoterica](https://evoluteur.github.io/esoterica.html).

Copyright (c) 2026 [Olivier Giulieri](https://evoluteur.github.io/).
