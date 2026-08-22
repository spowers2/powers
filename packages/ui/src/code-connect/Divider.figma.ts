// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-86
// source=packages/ui/src/components/Divider.tsx
// component=Divider

import figma from 'figma'

// Kit Orientation is visual-only; code Divider is a horizontal rule (optional label).
export default {
  example: figma.code`
  <Divider />
`,
  imports: ["import { Divider } from '@powers/ui'"],
  id: 'divider',
  metadata: {
    nestable: true,
  },
}
