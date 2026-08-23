// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-276
// source=packages/ui/src/components/Collapse.tsx
// component=Collapse

import figma from 'figma'

const instance = figma.selectedInstance
const open = instance.getBoolean('Open')

export default {
  example: figma.code`
  <Collapse open={${open}}>
    Collapsed content
  </Collapse>
`,
  imports: ["import { Collapse } from '@lab206/ui'"],
  id: 'collapse',
  metadata: {
    nestable: true,
  },
}
