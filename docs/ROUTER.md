# `@powers/router`

## Learn in 2 minutes

```tsx
import { createRouter, Link } from "@powers/router";
import { mount } from "@powers/dom";

const router = createRouter({
  routes: [
    { path: "/", component: () => <Home /> },
    { path: "/users/:id", component: ({ params }) => <User id={params.id} /> },
  ],
  notFound: () => <p>404</p>,
});

mount(document.getElementById("app")!, () => (
  <div>
    <Link router={router} to="/" exact activeClass="active">Home</Link>
    <Link router={router} to="/users/1">User</Link>
    {router.outlet()}
  </div>
));
```

## API

| API | Role |
|---|---|
| `createRouter({ routes, mode? })` | Build router |
| `router.outlet()` | Active page host |
| `router.navigate(path)` | Programmatic nav |
| `router.path()` / `params()` / `location()` | Signals |
| `Link` | `<a>` without full reload |
| `mode: "history" \| "hash" \| "memory"` | history default in browser; memory for tests |

Patterns: `/about`, `/users/:id`, `/files/*path`
