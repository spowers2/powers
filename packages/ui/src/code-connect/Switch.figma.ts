// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-131
// source=packages/ui/src/components/Switch.tsx
// component=Switch

import figma from 'figma'

const instance = figma.selectedInstance
const checked = instance.getBoolean('Checked')
const disabled = instance.getBoolean('Disabled')
const label = instance.getString('Label')

export default {
  example: figma.code`
  <Switch checked={${checked}} disabled={${disabled}} label={${label}} />
`,
  imports: ["import { Switch } from '@powers/ui'"],
  id: "switch",
  metadata: {
    nestable: true,
  },
}
