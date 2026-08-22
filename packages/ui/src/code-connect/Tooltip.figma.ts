// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-41
// source=packages/ui/src/components/Tooltip.tsx
// component=Tooltip

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')

export default {
  example: figma.code`
  <Tooltip content={${label}}>
    <Button>Hover me</Button>
  </Tooltip>
`,
  imports: ["import { Tooltip, Button } from '@powers/ui'"],
  id: 'tooltip',
  metadata: {
    nestable: true,
  },
}
