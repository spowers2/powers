// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-178
// source=packages/ui/src/components/Chip.tsx
// component=Chip

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
const removable = instance.getBoolean('Removable')
const tone = instance.getEnum('Tone', {
  neutral: 'neutral',
  accent: 'accent',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
})

export default {
  example: removable
    ? figma.code`
  <Chip tone={${tone}} onRemove={() => {}}>
    ${label}
  </Chip>
`
    : figma.code`
  <Chip tone={${tone}}>
    ${label}
  </Chip>
`,
  imports: ["import { Chip } from '@powers/ui'"],
  id: 'chip',
  metadata: {
    nestable: true,
  },
}
