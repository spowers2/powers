// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=8-30
// source=packages/ui/src/components/Toast.tsx
// component=Toaster

import figma from 'figma'

const instance = figma.selectedInstance
const title = instance.getString('Title')
const description = instance.getString('Description')
const tone = instance.getEnum('Tone', {
  info: 'info',
  success: 'success',
  danger: 'danger',
})

export default {
  example: figma.code`
  // Mount once: <Toaster toaster={toaster} />
  // Then push from events:
  toaster.push({
    title: ${title},
    description: ${description},
    tone: ${tone},
  })
`,
  imports: [
    "import { createToaster, Toaster } from '@lab206/ui'",
  ],
  id: 'toast',
  metadata: {
    nestable: false,
  },
}
