// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-134
// source=packages/ui/src/components/Tabs.tsx
// component=Tabs

import figma from 'figma'

const instance = figma.selectedInstance
const active = instance.getEnum('Active', {
  'tab-1': 'tab-1',
  'tab-2': 'tab-2',
  'tab-3': 'tab-3',
})

export default {
  example: figma.code`
  <Tabs
    value={${active}}
    onChange={() => {}}
    items={[
      { id: 'tab-1', label: 'Tab 1', content: 'Panel 1' },
      { id: 'tab-2', label: 'Tab 2', content: 'Panel 2' },
      { id: 'tab-3', label: 'Tab 3', content: 'Panel 3' },
    ]}
  />
`,
  imports: ["import { Tabs } from '@powers/ui'"],
  id: 'tabs',
  metadata: {
    nestable: false,
  },
}
