// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-94
// source=packages/ui/src/components/Popover.tsx
// component=Popover

import figma from 'figma'

export default {
  example: figma.code`
  <Popover
    open={true}
    onOpenChange={() => {}}
    trigger={<Button>Open</Button>}
  >
    Popover content
  </Popover>
`,
  imports: ["import { Popover, Button } from '@powers/ui'"],
  id: 'popover',
  metadata: {
    nestable: false,
  },
}
