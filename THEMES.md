# Themes & Templates

## Themes

All theme colours live in `assets/themes.css`. The current presets are:

- **Royal Gold** — dark + gold, closest to the original luxury feel
- **Rose Romance** — dark rose/pink
- **Emerald** — deep green + soft gold/green
- **Midnight** — blue-black + icy blue
- **Ivory** — light warm neutral + brown/gold

To create a new theme, add another `[data-theme="your-theme"]` block and add it to `THEMES` in `assets/app.js`.

## Templates

Templates are layout classes rather than separate HTML pages. V1 includes:

- `classic` — script-style hero, round photo, soft cards
- `minimal` — cleaner typography and sharper cards
- `luxury` — framed hero and stronger card shadows

To add a template, create another CSS block in `assets/invitation.css` and add the new radio option in `index.html`.

## Customer flow

The customer never edits these files. They only use the builder form.
