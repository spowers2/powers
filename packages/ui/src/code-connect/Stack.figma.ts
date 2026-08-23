// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-222
// source=packages/ui/src/components/Stack.tsx
// component=Stack

import figma from 'figma'

const instance = figma.selectedInstance
const direction = instance.getEnum('Direction', {
  vertical: 'column',
  horizontal: 'row',
})
const gap = instance.getEnum('Gap', {
  '0': 0,
  '1': 1,
  '2': 2,
  '3': 3,
  '4': 4,
  '5': 5,
  '6': 6,
  '8': 8,
})

export default {
  example: figma.code`
  <Stack direction={${direction}} gap={${gap}}>
    {/* children */}
  </Stack>
`,
  imports: ["import { Stack } from '@lab206/ui'"],
  id: "stack",
  metadata: {
    nestable: true,
  },
}
