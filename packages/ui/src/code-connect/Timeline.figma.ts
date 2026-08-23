// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-262
// source=packages/ui/src/components/Timeline.tsx
// component=Timeline

import figma from 'figma'

export default {
  example: figma.code`
  <Timeline
    items={[
      {
        id: '1',
        title: 'Created',
        time: 'Today',
        description: 'Started the project',
      },
    ]}
  />
`,
  imports: ["import { Timeline } from '@lab206/ui'"],
  id: 'timeline',
  metadata: {
    nestable: true,
  },
}
