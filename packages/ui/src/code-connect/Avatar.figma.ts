// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-185
// source=packages/ui/src/components/Avatar.tsx
// component=Avatar

import figma from 'figma'

const instance = figma.selectedInstance
const initials = instance.getString('Initials')
const size = instance.getEnum('Size', {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
})

export default {
  example: figma.code`
  <Avatar size={${size}} name={${initials}} />
`,
  imports: ["import { Avatar } from '@lab206/ui'"],
  id: 'avatar',
  metadata: {
    nestable: true,
  },
}
