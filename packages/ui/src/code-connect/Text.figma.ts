// url=https://www.figma.com/design/bdfYWkMm5oJqKBIrwWCsSd/Powers-UI-Kit?node-id=6-74
// source=packages/ui/src/components/Text.tsx
// component=Text

import figma from 'figma'

const instance = figma.selectedInstance
const label = instance.getString('Label')
const muted = instance.getBoolean('Muted')
const size = instance.getEnum('Size', {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  '2xl': '2xl',
})
const weight = instance.getEnum('Weight', {
  normal: 'normal',
  medium: 'medium',
  semibold: 'semibold',
  bold: 'bold',
})

export default {
  example: figma.code`
  <Text size={${size}} weight={${weight}} muted={${muted}}>
    ${label}
  </Text>
`,
  imports: ["import { Text } from '@lab206/ui'"],
  id: "text",
  metadata: {
    nestable: true,
  },
}
