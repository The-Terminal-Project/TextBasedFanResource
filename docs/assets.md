# Asset Overview

This project stores nearly all runtime assets under the `web/` directory. Below are the most common locations and naming patterns.

## `web/images`
Image sprites, backgrounds and icons. Frequently used subdirectories include:

- `Hair` – hair and hair_back sprites named `hair<number>.png` and `hair_back<number>.png`.
- `Bodies` – body sprites such as `baby<number>.png` and god tier outfits.
- `Items`, `Lands`, `Rewards` – various UI and gameplay images.
- `LORAS`, `LORAS2`, `A03` – older content and fan art collections.
- `observatory` – UI pieces for the observatory scene.
- `Tmp` – temporary resources (contains an unused spreadsheet).

Most images are loaded by the Dart loader at runtime. Only files referenced in code or the manifest are fetched. The manifest example in `web/manifest/sourcemanifest.txt` lists the hair and baby sprites bundled at build time.

## `web/audio`
Holds audio tracks in both `.ogg` and `.mp3` formats. The loader picks the type supported by the browser via `Audio.load()`.

Current runtime usage only references `audio/spiderblood`, but additional music files exist in `images/LORAS2`. Those appear unused and may be legacy assets.

## `web/shaders`
Vertex (`.vert`) and fragment (`.frag`) programs for WebGL rendering. Examples include `image.vert`, `nullglitch.frag` and `stardustglitch.frag`. They are loaded on demand by the rendering pipeline in `web/scripts/Rendering`.

## `web/models`
3‑D object files such as `overcoat.obj`. These are loaded with `OBJLoader2` when required.

## `web/Fonts`
TrueType fonts (`.ttf`) used by the site. They follow straightforward file names like `Alternian.ttf`.

## Unused or Legacy Assets
Several directories contain assets that are not referenced in the current code base:

- `web/images/Tmp` – only stores a spreadsheet and can likely be removed.
- `web/images/LORAS` and `web/images/LORAS2` – appear to contain experimental images and music.
- `web/images/A03` – older art from a previous project.
- Extra audio files within `images/LORAS2` that are not loaded at runtime.

These folders may be safe to prune if disk usage becomes an issue.
