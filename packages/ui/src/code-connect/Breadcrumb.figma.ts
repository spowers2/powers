// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-135
// source=packages/ui/src/components/Breadcrumb.tsx
// component=Breadcrumb

import figma from 'figma'

export default {
  example: figma.code`
  <Breadcrumb
    items={[
      { id: 'home', label: 'Home', href: '/' },
      { id: 'current', label: 'Current' },
    ]}
  />
`,
  imports: ["import { Breadcrumb } from '@powers/ui'"],
  id: 'breadcrumb',
  metadata: {
    nestable: true,
  },
}
