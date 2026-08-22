// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-223
// source=packages/ui/src/components/Table.tsx
// component=Table

import figma from 'figma'

export default {
  example: figma.code`
  <Table
    columns={[
      { key: 'name', header: 'Name' },
      { key: 'status', header: 'Status' },
    ]}
    rows={[{ name: 'Ada', status: 'Active' }]}
    rowKey="name"
  />
`,
  imports: ["import { Table } from '@powers/ui'"],
  id: 'table',
  metadata: {
    nestable: true,
  },
}
