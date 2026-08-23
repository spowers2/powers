// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-108
// source=packages/ui/src/components/Textarea.tsx
// component=Textarea

import figma from 'figma'

const instance = figma.selectedInstance
const placeholder = instance.getString('Placeholder')
const disabled = instance.getBoolean('Disabled')

export default {
  example: figma.code`
  <Textarea placeholder={${placeholder}} disabled={${disabled}} />
`,
  imports: ["import { Textarea } from '@lab206/ui'"],
  id: "textarea",
  metadata: {
    nestable: true,
  },
}
