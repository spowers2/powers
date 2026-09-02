import type { Router } from "@lab206/router";
import { Link } from "@lab206/router";

export type Crumb = {
  label: string;
  href?: string;
};

/** Clear “where am I / how did I get here”. */
export function PageChrome(props: {
  router: Router;
  title: string;
  /** One sentence: what this screen is for */
  purpose: string;
  crumbs: Crumb[];
  actions?: unknown;
  children?: unknown;
}) {
  const { router, title, purpose, crumbs, actions, children } = props;

  return (
    <div class="stack-gap">
      <nav class="crumbs" aria-label="Breadcrumb">
        {crumbs.flatMap((c, i) => {
          const nodes = [];
          if (i > 0) {
            nodes.push(
              <span class="crumbs__sep" aria-hidden="true">
                /
              </span>,
            );
          }
          nodes.push(
            c.href ? (
              <Link router={router} to={c.href} class="crumbs__link">
                {c.label}
              </Link>
            ) : (
              <span class="crumbs__here">{c.label}</span>
            ),
          );
          return nodes;
        })}
      </nav>

      <div class="page-head">
        <div>
          <h1>{title}</h1>
          <p class="page-purpose">{purpose}</p>
        </div>
        {actions ? <div class="row-gap">{actions}</div> : null}
      </div>

      {children as never}
    </div>
  );
}
