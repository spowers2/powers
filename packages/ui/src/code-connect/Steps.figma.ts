// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-328
// source=packages/ui/src/components/Steps.tsx
// component=Steps

import figma from 'figma'

const instance = figma.selectedInstance
const current = instance.getEnum('State', {
  complete: 2,
  current: 1,
  upcoming: 0,
})

export default {
  example: figma.code`
  <Steps
    current={${current}}
    steps={[
      { id: '1', label: 'One' },
      { id: '2', label: 'Two' },
      { id: '3', label: 'Three' },
    ]}
  />
`,
  imports: ["import { Steps } from '@lab206/ui'"],
  id: 'steps',
  metadata: {
    nestable: true,
  },
}
