// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-101
// source=packages/ui/src/components/ToggleGroup.tsx
// component=ToggleGroup

import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('Size', {
  sm: 'sm',
  md: 'md',
})

export default {
  example: figma.code`
  <ToggleGroup
    size={${size}}
    value="day"
    onChange={() => {}}
    options={[
      { value: 'day', label: 'Day' },
      { value: 'week', label: 'Week' },
      { value: 'month', label: 'Month' },
    ]}
  />
`,
  imports: ["import { ToggleGroup } from '@lab206/ui'"],
  id: 'toggle-group',
  metadata: {
    nestable: true,
  },
}
