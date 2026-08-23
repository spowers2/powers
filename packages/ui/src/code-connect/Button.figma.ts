// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=5-38
// source=packages/ui/src/components/Button.tsx
// component=Button

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
const disabled = instance.getBoolean('Disabled')
const variant = instance.getEnum('Variant', {
  solid: 'solid',
  soft: 'soft',
  ghost: 'ghost',
  danger: 'danger',
})
const size = instance.getEnum('Size', {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
})

export default {
  example: figma.code`
  <Button variant={${variant}} size={${size}} disabled={${disabled}}>
    ${label}
  </Button>
`,
  imports: ["import { Button } from '@lab206/ui'"],
  id: "button",
  metadata: {
    nestable: true,
  },
}
