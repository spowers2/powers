// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-219
// source=packages/ui/src/components/Skeleton.tsx
// component=Skeleton

import figma from 'figma'

const instance = figma.selectedInstance
const variant = instance.getEnum('Variant', {
  text: 'text',
  rect: 'rect',
  circle: 'circle',
})

export default {
  example: figma.code`
  <Skeleton variant={${variant}} />
`,
  imports: ["import { Skeleton } from '@powers/ui'"],
  id: 'skeleton',
  metadata: {
    nestable: true,
  },
}
