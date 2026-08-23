// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-75
// source=packages/ui/src/components/Link.tsx
// component=Link

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')

export default {
  example: figma.code`
  <Link href="#">${label}</Link>
`,
  imports: ["import { Link } from '@lab206/ui'"],
  id: 'link',
  metadata: {
    nestable: true,
  },
}
