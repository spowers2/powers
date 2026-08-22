// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-96
// source=packages/ui/src/components/Command.tsx
// component=Command

import figma from 'figma'

export default {
  example: figma.code`
  <Command
    open={true}
    onOpenChange={() => {}}
    placeholder="Type a command…"
    items={[{ id: 'action', label: 'Action' }]}
    onSelect={() => {}}
  />
`,
  imports: ["import { Command } from '@powers/ui'"],
  id: 'command',
  metadata: {
    nestable: false,
  },
}
