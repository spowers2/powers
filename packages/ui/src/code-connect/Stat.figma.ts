// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-199
// source=packages/ui/src/components/Stat.tsx
// component=Stat

import figma from 'figma'

export default {
  example: figma.code`
  <Stat label="Revenue" value="$12.4k" delta="+4.2%" tone="positive" />
`,
  imports: ["import { Stat } from '@lab206/ui'"],
  id: 'stat',
  metadata: {
    nestable: true,
  },
}
