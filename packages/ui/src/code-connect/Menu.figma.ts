// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-87
// source=packages/ui/src/components/Menu.tsx
// component=Menu

import figma from 'figma'

export default {
  example: figma.code`
  <Menu
    trigger={<Button>Open menu</Button>}
    onSelect={() => {}}
    items={[
      { id: 'edit', label: 'Edit' },
      { id: 'delete', label: 'Delete', danger: true },
    ]}
  />
`,
  imports: ["import { Menu, Button } from '@powers/ui'"],
  id: 'menu',
  metadata: {
    nestable: false,
  },
}
