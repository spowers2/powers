// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-253
// source=packages/ui/src/components/Container.tsx
// component=Container

import figma from 'figma'

const instance = figma.selectedInstance
const size = instance.getEnum('Size', {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
})

export default {
  example: figma.code`
  <Container size={${size}}>
    Content
  </Container>
`,
  imports: ["import { Container } from '@lab206/ui'"],
  id: 'container',
  metadata: {
    nestable: true,
  },
}
