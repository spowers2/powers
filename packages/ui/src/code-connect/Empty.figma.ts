// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-220
// source=packages/ui/src/components/Empty.tsx
// component=Empty

import figma from 'figma'

export default {
  example: figma.code`
  <Empty title="Nothing here" description="Try a different filter." />
`,
  imports: ["import { Empty } from '@powers/ui'"],
  id: 'empty',
  metadata: {
    nestable: true,
  },
}
