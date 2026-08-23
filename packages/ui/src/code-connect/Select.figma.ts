// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-111
// source=packages/ui/src/components/Select.tsx
// component=Select

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
const disabled = instance.getBoolean('Disabled')

export default {
  example: figma.code`
  <Select
    placeholder={${label}}
    disabled={${disabled}}
    options={[
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
    ]}
  />
`,
  imports: ["import { Select } from '@lab206/ui'"],
  id: 'select',
  metadata: {
    nestable: true,
  },
}
