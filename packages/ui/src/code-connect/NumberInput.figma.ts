// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-115
// source=packages/ui/src/components/NumberInput.tsx
// component=NumberInput

import figma from 'figma'

export default {
  example: figma.code`
  <NumberInput value={42} onChange={() => {}} />
`,
  imports: ["import { NumberInput } from '@powers/ui'"],
  id: 'number-input',
  metadata: {
    nestable: true,
  },
}
