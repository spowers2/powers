/** Short legend so status chips aren’t mysterious. */
export function StatusLegend() {
  return (
    <div class="legend" aria-label="Status meanings">
      <span class="legend__title">Statuses</span>
      <span class="chip chip--dim">draft</span>
      <span class="legend__hint">not booked yet</span>
      <span class="chip chip--warn">booked</span>
      <span class="legend__hint">carrier assigned</span>
      <span class="chip">in_transit</span>
      <span class="legend__hint">moving</span>
      <span class="chip chip--hot">at_risk</span>
      <span class="legend__hint">late / blocked</span>
      <span class="chip chip--ok">delivered</span>
      <span class="legend__hint">complete</span>
    </div>
  );
}
