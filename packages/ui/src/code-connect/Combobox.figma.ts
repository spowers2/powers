// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-150
// source=packages/ui/src/components/Combobox.tsx
// component=Combobox

import figma from 'figma'

export default {
  example: figma.code`
  <Combobox
    placeholder="Search…"
    options={[{ value: 'a', label: 'Option A' }]}
    onChange={() => {}}
  />
`,
  imports: ["import { Combobox } from '@powers/ui'"],
  id: 'combobox',
  metadata: {
    nestable: true,
  },
}
