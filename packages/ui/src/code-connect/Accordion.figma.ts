// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-152
// source=packages/ui/src/components/Accordion.tsx
// component=Accordion

import figma from 'figma'

const instance = figma.selectedInstance
const open = instance.getBoolean('Open')

export default {
  example: figma.code`
  <Accordion
    single
    defaultValue={${open ? ['section'] : []}}
    items={[
      {
        id: 'section',
        title: 'Section',
        content: 'Panel content',
      },
    ]}
  />
`,
  imports: ["import { Accordion } from '@powers/ui'"],
  id: 'accordion',
  metadata: {
    nestable: true,
  },
}
