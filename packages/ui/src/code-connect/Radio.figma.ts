// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-126
// source=packages/ui/src/components/Radio.tsx
// component=RadioGroup

import figma from 'figma'

const instance = figma.selectedInstance
const checked = instance.getBoolean('Checked')
const label = instance.getString('Label')

export default {
  example: figma.code`
  <RadioGroup
    name="option"
    value={${checked ? 'a' : ''}}
    onChange={() => {}}
    options={[{ value: 'a', label: ${label} }]}
  />
`,
  imports: ["import { RadioGroup } from '@lab206/ui'"],
  id: 'radio-group',
  metadata: {
    nestable: true,
  },
}
