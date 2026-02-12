# Nav Header Animation

## Overview

The header is a single `<nav>` element that transforms between two states -- a
collapsed pill and an expanded card -- driven by a single `open` boolean. All
animation is pure CSS transitions; no JavaScript animation libraries are used.

## States

**Collapsed (pill):** Fixed width (`w-44`, `w-48` on desktop), fully rounded
corners (`rounded-3xl`), compact padding (`px-3 py-2`), light shadow. Shows a
welcome message or username on the left, hamburger icon on the right.

**Expanded (card):** Wider (`w-72`, `w-80` on desktop), softer corners
(`rounded-2xl`), more padding (`p-4`), heavier shadow. Shows the same top row
plus a list of navigation links below it.

## Animation sequence on open

1. **Overlay fades in.** A full-screen `<button>` with `bg-black/50` and
   `backdrop-blur-sm` appears using Svelte's `transition:fade` (200ms). This
   darkens and blurs the page behind the nav.

2. **The pill expands into a card.** The `<nav>` element has `transition-all
duration-300 ease-out` applied at all times. When `open` flips to true,
   Tailwind classes swap and CSS transitions the following properties
   simultaneously over 300ms:
   - `width`: 176px to 288px (or 192px to 320px on desktop). Both states use
     fixed widths so CSS can interpolate between them. An earlier version used
     `auto` width on the collapsed state, which caused the width to snap
     instantly because CSS cannot transition from `auto` to a fixed value.
   - `border-radius`: `rounded-3xl` (24px) to `rounded-2xl` (16px). We use
     `rounded-3xl` instead of `rounded-full` (9999px) because the collapsed
     pill is short enough that 24px still gets clamped to a perfect pill shape,
     but the transition from 24px to 16px is smooth. With 9999px, the
     interpolation would spend 99% of its duration at values too large to
     matter, then snap at the end.
   - `padding`: `px-3 py-2` to `p-4`.
   - `box-shadow`: `shadow-lg` to `shadow-xl`.

3. **The menu icon rotates and swaps.** The icon wrapper has
   `transition-transform duration-300`. On open it rotates 90 degrees
   (`rotate-90`), and the `Menu` icon is replaced with `X` via a Svelte `{#if}`
   block. The icon sits in a flex row with `ml-auto`, so it stays pinned to the
   top-right corner as the card widens.

4. **Links reveal via grid height transition.** The links container is a CSS
   grid with `transition-[grid-template-rows] duration-300 ease-out`. It
   toggles between `grid-rows-[0fr]` (collapsed, zero height) and
   `grid-rows-[1fr]` (expanded, full height). A child `overflow-hidden` div
   prevents content from overflowing during the transition.

5. **Links stagger in.** Each link has `opacity` and `translate-y` transitions
   (100ms duration) with an increasing `transition-delay` calculated as
   `80 + index * 50` ms. This means:
   - The first link starts fading in 80ms after the card begins expanding.
   - Each subsequent link follows 50ms later.
   - The separator and auth action (Login/Logout) continue the stagger
     sequence after the last nav link.

## Animation sequence on close

The same properties transition in reverse, with one key difference: all link
`transition-delay` values are set to `0ms` when `open` is false. This makes
every link disappear simultaneously and instantly, so the card can collapse
without visible text lingering inside it.

## Positioning

The `<nav>` is `fixed top-4 left-1/2 -translate-x-1/2`, which centers it
horizontally at 1rem from the top of the viewport. Because horizontal centering
is done via `left-1/2` + `translateX(-50%)`, width changes expand equally to
both sides. The top edge stays fixed, so expansion only goes left, right, and
downward.

## Closing the menu

Three methods:

- Clicking the X icon (toggles `open`).
- Clicking the overlay (calls `close()`).
- Pressing Escape (captured via `svelte:window onkeydown`).
