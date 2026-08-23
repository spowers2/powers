// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-83
// source=packages/ui/src/components/Code.tsx
// component=Code

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
const block = instance.getEnum('Variant', {
  inline: false,
  block: true,
})

export default {
  example: figma.code`
  <Code block={${block}}>${label}</Code>
`,
  imports: ["import { Code } from '@lab206/ui'"],
  id: 'code',
  metadata: {
    nestable: true,
  },
}
