// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-80
// source=packages/ui/src/components/Drawer.tsx
// component=Drawer

import figma from 'figma'

export default {
  example: figma.code`
  <Drawer open={true} onClose={() => {}} title="Drawer">
    Drawer body
  </Drawer>
`,
  imports: ["import { Drawer } from '@lab206/ui'"],
  id: 'drawer',
  metadata: {
    nestable: false,
  },
}
