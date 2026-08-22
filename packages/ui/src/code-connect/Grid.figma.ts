// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-244
// source=packages/ui/src/components/Grid.tsx
// component=Grid

import figma from 'figma'

const instance = figma.selectedInstance
const cols = instance.getEnum('Columns', {
  '2': 2,
  '3': 3,
  '4': 4,
})

export default {
  example: figma.code`
  <Grid cols={${cols}} gap={4}>
    {/* cells */}
  </Grid>
`,
  imports: ["import { Grid } from '@powers/ui'"],
  id: 'grid',
  metadata: {
    nestable: true,
  },
}
