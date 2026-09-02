import { Button } from "@lab206/ui";
import type { Router } from "@lab206/router";

/** Public marketing landing — corporate business banking. */
export function MarketingPage(props: { router: Router }) {
  const { router } = props;

  return (
    <div class="mkt">
      <section class="mkt-hero">
        <div class="mkt-pill">Modern banking infrastructure for growing companies</div>
        <h1 class="mkt-title">
          Business banking,
          <br />
          <span class="mkt-title-muted">built for operations</span>
        </h1>
        <p class="mkt-lede">
          Accounts, automated workflows, and growth capital in one calm
          console — a Powers product demo for agencies and product teams.
        </p>
        <div class="mkt-cta-row">
          <Button size="lg" onClick={() => router.navigate("/dashboard")}>
            Enter the console →
          </Button>
          <Button
            size="lg"
            variant="soft"
            onClick={() => router.navigate("/capital")}
          >
            Explore capital
          </Button>
        </div>
      </section>

      <section class="mkt-features">
        <div class="mkt-feature">
          <div class="mkt-feature__icon" aria-hidden="true">
            ⚡
          </div>
          <h3>Instant workflows</h3>
          <p>
            Automate payments, approvals, and reconciliation with controlled
            workflow automation.
          </p>
        </div>
        <div class="mkt-feature">
          <div class="mkt-feature__icon" aria-hidden="true">
            🛡
          </div>
          <h3>Enterprise security</h3>
          <p>
            Bank-grade posture narrative — SOC 2 Type II and ISO 27001 style
            controls for the demo story.
          </p>
        </div>
        <div class="mkt-feature">
          <div class="mkt-feature__icon" aria-hidden="true">
            ↗
          </div>
          <h3>Growth capital</h3>
          <p>
            Working capital and revenue-based products for the business — and
            platform-style financing for partners.
          </p>
        </div>
      </section>

      <section class="mkt-band">
        <div class="mkt-band__inner">
          <div class="mkt-pill mkt-pill--light">Capital for platforms</div>
          <h2>Business financing for your customers</h2>
          <p>
            Offer fast, flexible capital to businesses on your platform. Help
            customers grow while you earn revenue share on every loan — demo
            numbers, real product pattern.
          </p>
          <ul class="mkt-checks">
            <li>
              <b>Instant approvals</b> — funding decisions in minutes, not days
            </li>
            <li>
              <b>No platform risk</b> — credit and compliance stay with the
              lender narrative
            </li>
            <li>
              <b>Revenue share</b> — earn up to 20% of interest in the story
            </li>
          </ul>
          <Button onClick={() => router.navigate("/capital")}>
            Learn more →
          </Button>
        </div>
      </section>

      <section class="mkt-stats">
        <div>
          <div class="mkt-stat__n">$2.4B+</div>
          <div class="mkt-stat__l">Processed annually</div>
        </div>
        <div>
          <div class="mkt-stat__n">50K+</div>
          <div class="mkt-stat__l">Active businesses</div>
        </div>
        <div>
          <div class="mkt-stat__n">99.9%</div>
          <div class="mkt-stat__l">Uptime guarantee</div>
        </div>
      </section>

      <section class="mkt-footer-cta">
        <h2>Ready to walk the product?</h2>
        <p>
          Open the signed-in console — dashboard, workflows, accounts, and
          capital — built with Powers.
        </p>
        <Button size="lg" variant="soft" onClick={() => router.navigate("/dashboard")}>
          Get started →
        </Button>
      </section>
    </div>
  );
}
