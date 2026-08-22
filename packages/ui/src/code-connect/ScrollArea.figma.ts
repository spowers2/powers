// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-254
// source=packages/ui/src/components/ScrollArea.tsx
// component=ScrollArea

import figma from 'figma'

export default {
  example: figma.code`
  <ScrollArea maxHeight="12rem">
    Long content…
  </ScrollArea>
`,
  imports: ["import { ScrollArea } from '@powers/ui'"],
  id: 'scroll-area',
  metadata: {
    nestable: true,
  },
}
