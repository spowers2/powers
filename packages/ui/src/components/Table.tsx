import { For, component, type ComponentProps } from "@power-ux/dom";
import { cx } from "../utils.js";
import { createStyleSheet } from "../styles.js";

export type TableColumn<T = Record<string, unknown>> = {
  key: string;
  header: string;
  /** Cell renderer; defaults to row[key] */
  cell?: (row: T) => unknown;
  align?: "left" | "center" | "right";
  width?: string;
};

export type TableProps<T = Record<string, unknown>> = {
  columns: TableColumn<T>[] | (() => TableColumn<T>[]);
  rows: T[] | (() => T[]);
  /** Row key field or function */
  rowKey?: string | ((row: T) => string);
  dense?: boolean;
  class?: string | (() => string);
  onRowClick?: (row: T) => void;
};

const ensure = createStyleSheet(
  "table",
  `
.pu-table-wrap {
  width: 100%;
  overflow: auto;
  border: 1px solid var(--pu-color-border);
  border-radius: var(--pu-radius-lg);
  background: var(--pu-color-surface);
}
.pu-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--pu-text-sm);
}
.pu-table th,
.pu-table td {
  padding: 0.7rem 0.9rem;
  text-align: left;
  border-bottom: 1px solid var(--pu-color-border);
  vertical-align: middle;
}
.pu-table--dense th,
.pu-table--dense td {
  padding: 0.45rem 0.7rem;
}
.pu-table th {
  font-weight: var(--pu-font-semibold);
  color: var(--pu-color-text-muted);
  background: var(--pu-color-surface-2);
  font-size: var(--pu-text-xs);
  letter-spacing: 0.02em;
  text-transform: uppercase;
  white-space: nowrap;
}
.pu-table tbody tr:last-child td { border-bottom: 0; }
.pu-table tbody tr.is-clickable { cursor: pointer; }
.pu-table tbody tr.is-clickable:hover td {
  background: color-mix(in srgb, var(--pu-color-accent) 6%, transparent);
}
.pu-table .align-center { text-align: center; }
.pu-table .align-right { text-align: right; }
.pu-table__empty {
  padding: 1.5rem;
  text-align: center;
  color: var(--pu-color-text-muted);
  font-size: var(--pu-text-sm);
}
`,
);

function keyOf<T>(row: T, rowKey: TableProps<T>["rowKey"], index: number): string {
  if (typeof rowKey === "function") return rowKey(row);
  if (typeof rowKey === "string" && row && typeof row === "object") {
    const v = (row as Record<string, unknown>)[rowKey];
    if (v != null) return String(v);
  }
  return String(index);
}

/** Data table with optional dense mode + row click. */
export const Table = component((raw: TableProps) => {
  ensure();
  const props = raw as ComponentProps<TableProps>;
  const getCols = () =>
    typeof props.columns === "function"
      ? (props.columns as () => TableColumn[])()
      : (props.columns ?? []);
  const getRows = () =>
    typeof props.rows === "function"
      ? (props.rows as () => Record<string, unknown>[])()
      : (props.rows ?? []);

  return (
    <div
      class={() =>
        cx(
          "pu-table-wrap",
          typeof props.class === "function" ? props.class() : props.class,
        )
      }
      ref={(el) => ensure(el.ownerDocument)}
    >
      <table class={() => cx("pu-table", props.dense && "pu-table--dense")}>
        <thead>
          <tr>
            <For each={getCols}>
              {(col) => (
                <th
                  class={() =>
                    col().align && col().align !== "left"
                      ? `align-${col().align}`
                      : undefined
                  }
                  style={() =>
                    col().width ? { width: col().width } : undefined
                  }
                >
                  {() => col().header}
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          {() => {
            const rows = getRows();
            if (rows.length === 0) {
              const tr = document.createElement("tr");
              const td = document.createElement("td");
              td.colSpan = Math.max(1, getCols().length);
              td.className = "pu-table__empty";
              td.textContent = "No rows";
              tr.appendChild(td);
              return tr;
            }
            const frag = document.createDocumentFragment();
            rows.forEach((row, i) => {
              const tr = document.createElement("tr");
              if (props.onRowClick) {
                tr.classList.add("is-clickable");
                tr.onclick = () => props.onRowClick?.(row);
              }
              for (const col of getCols()) {
                const td = document.createElement("td");
                if (col.align && col.align !== "left") {
                  td.className = `align-${col.align}`;
                }
                const content = col.cell
                  ? col.cell(row)
                  : (row as Record<string, unknown>)[col.key];
                if (content instanceof Node) td.appendChild(content);
                else td.textContent = content == null ? "" : String(content);
                tr.appendChild(td);
              }
              tr.dataset.key = keyOf(row, props.rowKey, i);
              frag.appendChild(tr);
            });
            return frag;
          }}
        </tbody>
      </table>
    </div>
  );
});
