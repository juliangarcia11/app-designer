# BUG-003: Dark mode toggle moves when scrolling overflowed content

## Status

- [ ] Open
- [ ] In Progress
- [x] Resolved
- [ ] Won't Fix

## Details

- **Created**: 2025-02-26
- **Resolved**: 2025-02-26
- **Priority**: Low
- **Affects**:
  - `App.tsx`
  - `theme-toggle.tsx`

## Description

When the viewing window becomes too large for the screen a scrollbar appears. If the user scrolls, so does the dark mode toggle.

## Steps to Reproduce

1. Open the application.
2. Resize the window to be smaller than the screen.
3. Scroll the content.

## Expected Behavior

Dark mode toggle stays stuck to the bottom left corner of the screen.

## Actual Behavior

Dark mode toggle moves with the scrolling content.

## Possible Solution

<!-- Ideas on how to fix it (optional)... -->

## Notes

<!-- Additional context, thoughts, or related information... -->

## Resolution

<!-- When fixed, note how it was resolved... -->
