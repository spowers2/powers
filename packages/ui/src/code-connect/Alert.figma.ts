// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-14
// source=packages/ui/src/components/Alert.tsx
// component=Alert

import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('Title')
const body = instance.getString('Body')
const tone = instance.getEnum('Tone', {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
})

export default {
  example: figma.code`
  <Alert tone={${tone}} title={${title}}>
    ${body}
  </Alert>
`,
  imports: ["import { Alert } from '@powers/ui'"],
  id: "alert",
  metadata: {
    nestable: true,
  },
}
