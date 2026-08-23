// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-275
// source=packages/ui/src/components/AspectRatio.tsx
// component=AspectRatio

import figma from 'figma'

const instance = figma.selectedInstance
const ratio = instance.getEnum('Ratio', {
  '1:1': 1,
  '16:9': 16 / 9,
  '4:3': 4 / 3,
})

export default {
  example: figma.code`
  <AspectRatio ratio={${ratio}}>
    {/* media */}
  </AspectRatio>
`,
  imports: ["import { AspectRatio } from '@lab206/ui'"],
  id: 'aspect-ratio',
  metadata: {
    nestable: true,
  },
}
