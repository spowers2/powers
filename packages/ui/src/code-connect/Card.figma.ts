// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-198
// source=packages/ui/src/components/Card.tsx
// component=Card

import figma from 'figma'

const instance = figma.selectedInstance
// Only Variant is a wired Figma property. Padded / Interactive were unused
// component props (invalid library asset) — remove them in Figma if still present.
// Code defaults: padded=true, interactive=false.
const variant = instance.getEnum('Variant', {
  default: 'default',
  glass: 'glass',
  elevated: 'elevated',
  soft: 'soft',
})

export default {
  example: figma.code`
  <Card variant={${variant}} padded>
    Content
  </Card>
`,
  imports: ["import { Card } from '@powers/ui'"],
  id: 'card',
  metadata: {
    nestable: true,
  },
}
