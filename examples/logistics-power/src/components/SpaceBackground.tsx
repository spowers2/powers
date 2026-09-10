/**
 * Full-viewport outer-space atmosphere — CSS-only layers, no canvas/SVG filters.
 * Motion is a slow translate on two star fields (composited); gated by data-lp-motion.
 */
export function SpaceBackground() {
  return (
    <div class="space-bg" aria-hidden="true">
      <div class="space-bg__nebula" />
      <div class="space-bg__stars space-bg__stars--far" />
      <div class="space-bg__stars space-bg__stars--near" />
      <div class="space-bg__twinkles">
        <span class="space-bg__twinkle space-bg__twinkle--a" />
        <span class="space-bg__twinkle space-bg__twinkle--b" />
        <span class="space-bg__twinkle space-bg__twinkle--c" />
      </div>
    </div>
  );
}
