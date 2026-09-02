/**
 * Full-viewport circuit atmosphere — sparse, distressed, not tiled.
 * Pulses are tiny glowing points (animateMotion), not dash segments.
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
          <radialGradient id="lp-circuit-fade" cx="50%" cy="45%" r="72%">
            <stop offset="0%" stop-color="white" stop-opacity="0.35" />
            <stop offset="45%" stop-color="white" stop-opacity="0.7" />
            <stop offset="100%" stop-color="white" stop-opacity="0" />
          </radialGradient>
          <mask id="lp-circuit-mask">
            <rect width="1440" height="900" fill="url(#lp-circuit-fade)" />
          </mask>
          <filter
            id="lp-dot-glow"
            x="-200%"
            y="-200%"
            width="500%"
            height="500%"
          >
            <feGaussianBlur stdDeviation="2.2" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Motion paths (referenced by animateMotion) */}
          <path id="lp-route-a" d="M48 140 H200 V270 H340 V175 H490" />
          <path id="lp-route-b" d="M1320 760 H1160 V640 H1000 V720" />
          <path id="lp-route-c" d="M1180 110 V230 H1300 V310" />
        </defs>

        <g mask="url(#lp-circuit-mask)" class="circuit-bg__ink">
          {/* Static board — incomplete / broken traces, hairlines */}
          <g class="circuit-bg__board">
            <path d="M48 140 H200 V270 H340 V175 H490" />
            <path d="M490 175 H540" class="circuit-bg__broken" />
            <path d="M80 520 H160 V590 H280 V545" />
            <path d="M280 545 H320" class="circuit-bg__broken" />
            <path d="M1180 110 V230 H1300 V310 H1380" />
            <path d="M1320 760 H1160 V640 H1000 V720 H920" />
            <path d="M920 720 H870" class="circuit-bg__broken" />
            <path d="M700 90 V180 H820 V130" />
            <path d="M820 130 H860" class="circuit-bg__broken" />
            <path d="M1080 480 H1180 V560" />
            <path d="M200 700 H280 V650" />
            <path d="M40 380 H90" class="circuit-bg__ghost" />
            <path d="M1360 420 V480" class="circuit-bg__ghost" />

            {/* Sparse vias — uneven sizes for a worn board feel */}
            <circle cx="200" cy="270" r="1.6" />
            <circle cx="340" cy="175" r="1.3" />
            <circle cx="160" cy="590" r="1.5" />
            <circle cx="1300" cy="310" r="1.4" />
            <circle cx="1160" cy="640" r="1.7" />
            <circle cx="820" cy="130" r="1.2" />
            <circle cx="1180" cy="560" r="1.3" />
            <circle cx="280" cy="650" r="1.1" />
          </g>

          {/* Tiny glowing points traveling a few routes */}
          <g class="circuit-bg__pulses" filter="url(#lp-dot-glow)">
            <circle class="circuit-dot circuit-dot--a" r="1.75" cx="0" cy="0">
              <animateMotion
                dur="22s"
                repeatCount="indefinite"
                rotate="auto"
              >
                <mpath href="#lp-route-a" />
              </animateMotion>
            </circle>
            <circle class="circuit-dot circuit-dot--b" r="1.5" cx="0" cy="0">
              <animateMotion
                dur="28s"
                begin="-9s"
                repeatCount="indefinite"
                rotate="auto"
              >
                <mpath href="#lp-route-b" />
              </animateMotion>
            </circle>
            <circle class="circuit-dot circuit-dot--c" r="1.35" cx="0" cy="0">
              <animateMotion
                dur="19s"
                begin="-4s"
                repeatCount="indefinite"
                rotate="auto"
              >
                <mpath href="#lp-route-c" />
              </animateMotion>
            </circle>
          </g>
        </g>
      </svg>
    </div>
  );
}
