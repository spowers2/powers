// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-144
// source=packages/ui/src/components/Field.tsx
// component=Field

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
const hint = instance.getString('Hint')
const hasError = instance.getBoolean('Error')

export default {
  example: figma.code`
  <Field
    label={${label}}
    hint={${hint}}
    error={${hasError ? 'Required' : undefined}}
  >
    <Input placeholder="you@example.com" />
  </Field>
`,
  imports: ["import { Field, Input } from '@lab206/ui'"],
  id: "field",
  metadata: {
    nestable: true,
  },
}
