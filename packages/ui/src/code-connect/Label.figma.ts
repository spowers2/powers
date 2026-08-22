// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-102
// source=packages/ui/src/components/Label.tsx
// component=Label

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')

export default {
  example: figma.code`
  <Label>${label}</Label>
`,
  imports: ["import { Label } from '@powers/ui'"],
  id: "label",
  metadata: {
    nestable: true,
  },
}
