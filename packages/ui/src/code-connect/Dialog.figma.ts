// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-79
// source=packages/ui/src/components/Dialog.tsx
// component=Dialog

import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('Title')
const description = instance.getString('Description')
const size = instance.getEnum('Size', {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
})

export default {
  example: figma.code`
  <Dialog
    open={true}
    onClose={() => {}}
    title={${title}}
    description={${description}}
    size={${size}}
  >
    Dialog body
  </Dialog>
`,
  imports: ["import { Dialog } from '@lab206/ui'"],
  id: "dialog",
}
