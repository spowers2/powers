// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-141
// source=packages/ui/src/components/Pagination.tsx
// component=Pagination

import figma from 'figma'

export default {
  example: figma.code`
  <Pagination page={1} pageCount={10} onChange={() => {}} />
`,
  imports: ["import { Pagination } from '@powers/ui'"],
  id: 'pagination',
  metadata: {
    nestable: true,
  },
}
