// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-140
// source=packages/ui/src/components/Slider.tsx
// component=Slider

import figma from 'figma'

export default {
  example: figma.code`
  <Slider value={50} min={0} max={100} onChange={() => {}} showValue />
`,
  imports: ["import { Slider } from '@powers/ui'"],
  id: 'slider',
  metadata: {
    nestable: true,
  },
}
