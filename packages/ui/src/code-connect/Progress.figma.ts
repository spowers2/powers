// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-215
// source=packages/ui/src/components/Progress.tsx
// component=Progress

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
const size = instance.getEnum('Size', {
  sm: 'sm',
  md: 'md',
})

export default {
  example: figma.code`
  <Progress value={60} size={${size}} label={${label}} />
`,
  imports: ["import { Progress } from '@lab206/ui'"],
  id: 'progress',
  metadata: {
    nestable: true,
  },
}
