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
