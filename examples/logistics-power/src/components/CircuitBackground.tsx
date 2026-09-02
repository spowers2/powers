/**
 * Full-viewport circuit atmosphere (not tiled).
 * Static traces always visible; traveling pulses only when motion is on.
 */
export function CircuitBackground() {
  return (
    <div class="circuit-bg" aria-hidden="true">
      <svg
        class="circuit-bg__svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="lp-circuit-fade" cx="50%" cy="42%" r="78%">
            <stop offset="0%" stop-color="white" stop-opacity="1" />
            <stop offset="55%" stop-color="white" stop-opacity="0.75" />
            <stop offset="100%" stop-color="white" stop-opacity="0.15" />
          </radialGradient>
          <mask id="lp-circuit-mask">
            <rect width="1440" height="900" fill="url(#lp-circuit-fade)" />
          </mask>
          <filter id="lp-pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g mask="url(#lp-circuit-mask)">
          {/* Static board traces — asymmetric, one composition */}
          <g class="circuit-bg__board">
            <path d="M40 120 H220 V280 H380 V160 H560 V320 H720" />
            <path d="M120 780 H300 V620 H480 V740 H680 V560 H860" />
            <path d="M980 80 V220 H1140 V380 H1280 V200 H1400" />
            <path d="M820 820 H1000 V680 H1180 V780 H1360" />
            <path d="M60 420 H180 V520 H340 V440 H500 V600" />
            <path d="M640 100 V240 H780 V140 H920 V300" />
            <path d="M400 500 H560 V420 H700 V540 H840 V460" />
            <path d="M1080 520 H1220 V640 H1340" />
            <path d="M200 200 V120 H80" />
            <path d="M1320 720 V800 H1200" />
            {/* vias / pads */}
            <circle cx="220" cy="280" r="3.5" />
            <circle cx="380" cy="160" r="3.5" />
            <circle cx="560" cy="320" r="3.5" />
            <circle cx="300" cy="620" r="3.5" />
            <circle cx="680" cy="560" r="3.5" />
            <circle cx="1140" cy="380" r="3.5" />
            <circle cx="1000" cy="680" r="3.5" />
            <circle cx="180" cy="520" r="3.5" />
            <circle cx="780" cy="240" r="3.5" />
            <circle cx="700" cy="540" r="3.5" />
            <circle cx="1220" cy="640" r="3.5" />
          </g>

          {/* Traveling light pulses — dash values are viewBox units (not pathLength/CSS px) */}
          <g class="circuit-bg__pulses" filter="url(#lp-pulse-glow)">
            <path
              class="circuit-pulse circuit-pulse--a"
              d="M40 120 H220 V280 H380 V160 H560 V320 H720"
            />
            <path
              class="circuit-pulse circuit-pulse--b"
              d="M120 780 H300 V620 H480 V740 H680 V560 H860"
            />
            <path
              class="circuit-pulse circuit-pulse--c"
              d="M980 80 V220 H1140 V380 H1280 V200 H1400"
            />
            <path
              class="circuit-pulse circuit-pulse--d"
              d="M400 500 H560 V420 H700 V540 H840 V460"
            />
            <path
              class="circuit-pulse circuit-pulse--e"
              d="M820 820 H1000 V680 H1180 V780 H1360"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
