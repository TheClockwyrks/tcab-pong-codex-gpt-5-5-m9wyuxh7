# Carom

Carom is a top-down paddle duel for the browser. Two paddles trade a fast ball
across a dark field, bending rallies with paddle-driven spin and using the two
center obstacles for bank shots.

## Install

```sh
npm ci
```

## Run in Development

```sh
npm run dev
```

Open the local URL Vite prints. The game runs entirely in the browser with no
backend or runtime downloads.

## Build

```sh
npm run build
```

The static production site is written to `dist/`, with `dist/index.html` as the
entry point.

## Controls

- Left paddle: `W` / `S`
- Right paddle in Versus: `ArrowUp` / `ArrowDown`
- Solo mode: either `W` / `S` or the arrow keys move the player paddle
- Confirm menu item: `Enter` or `Space`
- Back / pause: `Escape`
- Pause: `P`
- Mute: `M`

Move a paddle while striking the ball to add spin. A downward-moving paddle
curves the ball clockwise on screen; an upward-moving paddle curves it the other
way. First to 11 wins, with a two-point lead.
