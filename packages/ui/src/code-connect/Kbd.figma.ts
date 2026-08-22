// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-77
// source=packages/ui/src/components/Kbd.tsx
// component=Kbd

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')

export default {
  example: figma.code`
  <Kbd>${label}</Kbd>
`,
  imports: ["import { Kbd } from '@powers/ui'"],
  id: "kbd",
  metadata: {
    nestable: true,
  },
}
