/** Tiny science-beaker mark for lab206 — readable at ~16–28px. */
export function BrandMark(props: { class?: string }) {
  return (
    <svg
      class={props.class ?? "site-mark"}
      viewBox="0 0 32 32"
      width="24"
      height="24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        class="brand-mark__glass"
        d="M12.5 5.5h7M13.25 5.5V11.5L8.5 25.25c-.2.55.2 1.25.9 1.25h13.2c.7 0 1.1-.7.9-1.25L19.75 11.5V5.5"
        fill="none"
        stroke="currentColor"
        stroke-width="1.7"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        class="brand-mark__liquid"
        d="M10.1 21.2 8.85 24.7c-.08.22.08.5.36.5h13.58c.28 0 .44-.28.36-.5L21.9 21.2H10.1Z"
      />
      <path
        class="brand-mark__meniscus"
        d="M10.15 21.2h11.7"
        fill="none"
        stroke-width="1.15"
        stroke-linecap="round"
      />
      <circle class="brand-mark__bubble" cx="15.2" cy="23.1" r="1.05" />
    </svg>
  );
}
