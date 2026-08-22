// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-104
// source=packages/ui/src/components/Input.tsx
// component=Input

import figma from 'figma'

const instance = figma.selectedInstance
const placeholder = instance.getString('Placeholder')
const disabled = instance.getBoolean('Disabled')
const invalid = instance.getBoolean('Invalid')

export default {
  example: figma.code`
  <Input
    placeholder={${placeholder}}
    disabled={${disabled}}
    aria-invalid={${invalid}}
  />
`,
  imports: ["import { Input } from '@powers/ui'"],
  id: "input",
  metadata: {
    nestable: true,
  },
}
