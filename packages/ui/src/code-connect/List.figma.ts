// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-252
// source=packages/ui/src/components/List.tsx
// component=List

import figma from 'figma'

export default {
  example: figma.code`
  <List
    items={[
      { id: '1', label: 'Item one' },
      { id: '2', label: 'Item two' },
    ]}
    onSelect={() => {}}
  />
`,
  imports: ["import { List } from '@lab206/ui'"],
  id: 'list',
  metadata: {
    nestable: true,
  },
}
