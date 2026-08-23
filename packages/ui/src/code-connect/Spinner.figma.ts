// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-40
// source=packages/ui/src/components/Spinner.tsx
// component=Spinner

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
const size = instance.getEnum('Size', {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
})

export default {
  example: figma.code`
  <Spinner size={${size}} label={${label}} />
`,
  imports: ["import { Spinner } from '@lab206/ui'"],
  id: "spinner",
  metadata: {
    nestable: true,
  },
}
