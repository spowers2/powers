// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-120
// source=packages/ui/src/components/Checkbox.tsx
// component=Checkbox

import figma from 'figma'

const instance = figma.selectedInstance
const checked = instance.getBoolean('Checked')
const disabled = instance.getBoolean('Disabled')
const label = instance.getString('Label')

export default {
  example: figma.code`
  <Checkbox checked={${checked}} disabled={${disabled}} label={${label}} />
`,
  imports: ["import { Checkbox } from '@lab206/ui'"],
  id: "checkbox",
  metadata: {
    nestable: true,
  },
}
