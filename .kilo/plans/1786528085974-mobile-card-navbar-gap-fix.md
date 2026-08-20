# Mobile Card & Navbar Gap Fix

## Issues
1. **Sign in to DevSpace card is too large on mobile** — Previous changes (margin 12px→8px, padding 20px→16px) were too subtle to notice. The card needs more significant size reduction on mobile.
2. **Navbar right-corner gap when mobile menu is opened and zoomed out** — The `StaggeredMenu` fixed wrapper uses `width: 100vw` in CSS, which on mobile browsers (especially when zoomed out) exceeds the visible viewport and gets clipped by `body { overflow-x: hidden }`, creating a visible gap at the right edge.

## Plan

### Change 1: `src/components/GoogleOAuthPrompt.tsx`
Make the card noticeably more compact on mobile across all three variants (default, detected, last-user).

| Variant | Current (after previous partial fix) | Target |
|---------|-------------------------------------|--------|
| Default (line 180) | `left-2 right-2 ... p-4 sm:p-5 ... sm:w-[300px]` | `left-0 right-0 ... p-3 sm:p-4 ... sm:w-[300px]` |
| Detected (line 123) | `left-2 right-2 ... p-4 sm:p-5 ... sm:w-[320px]` | `left-0 right-0 ... p-3 sm:p-4 ... sm:w-[320px]` |
| Last user (line 153) | `left-2 right-2 ... p-4 sm:p-5 ... sm:w-[320px]` | `left-0 right-0 ... p-3 sm:p-4 ... sm:w-[320px]` |

- Replace `left-2 right-2` with `left-0 right-0` on all three cards (full-width on mobile).
- Replace `p-4 sm:p-5` with `p-3 sm:p-4` on all three cards.

### Change 2: `src/components/site.tsx`
Revert the previous incorrect header changes. The header itself is not the cause of the mobile-menu gap.

1. Restore `px-4` on the `<header>` element.
   - Target: `className="sticky top-0 z-20 flex items-center justify-between border-b-2 border-line bg-ink/90 px-4 py-4 backdrop-blur sm:px-8"`

2. Remove `px-4 sm:px-0` from the left and right flex child divs.
   - Left div: `className="flex items-center gap-2"`
   - Right div: `className="flex items-center gap-3"`

### Change 3: `src/components/ui/staggered-menu/StaggeredMenu.css`
Fix the `100vw` issue on the fixed wrapper that causes the right-corner gap when the mobile menu is open.

1. In `.staggered-menu-wrapper.fixed-wrapper` (lines 9-18), replace `width: 100vw` with `left: 0; right: 0` so the element respects the actual viewport width.
   - Current:
     ```css
     .staggered-menu-wrapper.fixed-wrapper {
       position: fixed;
       top: 0;
       left: 0;
       width: 100vw;
       height: 100vh;
       ...
     }
     ```
   - Target:
     ```css
     .staggered-menu-wrapper.fixed-wrapper {
       position: fixed;
       top: 0;
       left: 0;
       right: 0;
       height: 100vh;
       ...
     }
     ```

## Validation
- Run `npm run lint` and `npm run typecheck` after changes.
- Visually inspect on mobile viewport (≤640px) that:
  - Card spans full width with noticeably tighter padding.
  - When the mobile menu is opened, no gap appears at the right corner even when zoomed out.
  - Desktop (`sm+`) layout is unchanged.
