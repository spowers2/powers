// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-162
// source=packages/ui/src/components/Badge.tsx
// component=Badge

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
const tone = instance.getEnum('Tone', {
  neutral: 'neutral',
  accent: 'accent',
  success: 'success',
  warning: 'warning',
})

export default {
  example: figma.code`
  <Badge tone={${tone}}>{${label}}</Badge>
`,
  imports: ["import { Badge } from '@powers/ui'"],
  id: "badge",
  metadata: {
    nestable: true,
  },
}
