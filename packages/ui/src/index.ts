/**
 * @powers/ui — integrated design system (styling + components)
 *
 * Layers: tokens → primitives → optional utilities (see docs/STYLING.md)
 *
 * 1. import "@powers/ui/theme.css"   // tokens + base + utilities
 * 2. createTheme().bind(); createDensity().bind();
 * 3. Use Button, Field, Stack… (prefer primitives over raw utilities)
 * 4. Forms: <Input bind={signal} /> + Field error={…} — see docs/USABILITY.md
 *
 * Edit brand in: packages/ui/src/styles/tokens.css
 * Author new primitives: createStyleSheet + component() — see docs/COMPONENTS.md
 * Public docs hub: docs/README.md
 */

export { createTheme } from "./theme.js";
export type { ThemeMode, ThemeController } from "./theme.js";

export { createDensity } from "./density.js";
export type { Density, DensityController } from "./density.js";

export { cx, puId } from "./utils.js";

export { createStyleSheet, styleVars } from "./styles.js";
export {
  readProp,
  readBool,
  readStr,
  readNum,
  type MaybeReactive,
} from "./reactive.js";
export { trapFocus } from "./focusTrap.js";
export { attachOverlay } from "./overlay.js";
export type { OverlayAttachOptions, OverlayContext } from "./overlay.js";
export {
  listRovingItems,
  applyRovingTabIndex,
  focusRovingItem,
  handleRovingKeydown,
  initRovingFocus,
} from "./rovingFocus.js";
export type { RovingKeyOptions } from "./rovingFocus.js";

export {
  firstError,
  required,
  minLength,
  maxLength,
  emailFormat,
  matches,
  validateForm,
  eventValue,
  eventChecked,
  bindInput,
  bindString,
  bindSelect,
  bindChecked,
  asSelectBind,
  createField,
} from "./form.js";
export type {
  FieldError,
  Bindable,
  FieldHandle,
  CreateFieldOptions,
} from "./form.js";

export { MOTION_PRESETS, motionVars } from "./motion.js";
export type { MotionPreset, MotionPresetName } from "./motion.js";

export {
  devWarnOnce,
  warnIfThemeMissing,
  warnPossibleSnapshotValue,
  setDevWarnings,
  installDevWarnings,
} from "./dev.js";

// —— Layout ——
export { Stack } from "./components/Stack.js";
export type { StackProps } from "./components/Stack.js";

export { Grid } from "./components/Grid.js";
export type { GridProps } from "./components/Grid.js";

export { Container } from "./components/Container.js";
export type { ContainerProps } from "./components/Container.js";

export { Divider } from "./components/Divider.js";
export type { DividerProps } from "./components/Divider.js";

export { AspectRatio } from "./components/AspectRatio.js";
export type { AspectRatioProps } from "./components/AspectRatio.js";

export { ScrollArea } from "./components/ScrollArea.js";
export type { ScrollAreaProps } from "./components/ScrollArea.js";

export { Collapse } from "./components/Collapse.js";
export type { CollapseProps } from "./components/Collapse.js";

// —— Type ——
export { Text } from "./components/Text.js";
export type { TextProps } from "./components/Text.js";

export { Code } from "./components/Code.js";
export type { CodeProps } from "./components/Code.js";

export { Kbd } from "./components/Kbd.js";
export type { KbdProps } from "./components/Kbd.js";

export { Link } from "./components/Link.js";
export type { LinkProps } from "./components/Link.js";

// —— Forms ——
export { Button } from "./components/Button.js";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button.js";

export { Input } from "./components/Input.js";
export type { InputProps } from "./components/Input.js";

export { Textarea } from "./components/Textarea.js";
export type { TextareaProps } from "./components/Textarea.js";

export { Select } from "./components/Select.js";
export type { SelectProps, SelectOption } from "./components/Select.js";

export { Label } from "./components/Label.js";
export type { LabelProps } from "./components/Label.js";

export { Field } from "./components/Field.js";
export type { FieldProps } from "./components/Field.js";

export { Switch } from "./components/Switch.js";
export type { SwitchProps } from "./components/Switch.js";

export { Checkbox } from "./components/Checkbox.js";
export type { CheckboxProps } from "./components/Checkbox.js";

export { RadioGroup } from "./components/Radio.js";
export type { RadioGroupProps, RadioOption } from "./components/Radio.js";

export { Slider } from "./components/Slider.js";
export type { SliderProps } from "./components/Slider.js";

export { NumberInput } from "./components/NumberInput.js";
export type { NumberInputProps } from "./components/NumberInput.js";

export { ToggleGroup } from "./components/ToggleGroup.js";
export type { ToggleGroupProps, ToggleOption } from "./components/ToggleGroup.js";

export { Combobox } from "./components/Combobox.js";
export type { ComboboxProps, ComboboxOption } from "./components/Combobox.js";

// —— Surfaces & chrome ——
export { Card } from "./components/Card.js";
export type { CardProps } from "./components/Card.js";

export { Badge } from "./components/Badge.js";
export type { BadgeProps } from "./components/Badge.js";

export { Chip } from "./components/Chip.js";
export type { ChipProps, ChipTone } from "./components/Chip.js";

export { Avatar } from "./components/Avatar.js";
export type { AvatarProps, AvatarSize } from "./components/Avatar.js";

// —— Feedback ——
export { Alert } from "./components/Alert.js";
export type { AlertProps, AlertTone } from "./components/Alert.js";

export { Spinner } from "./components/Spinner.js";
export type { SpinnerProps, SpinnerSize } from "./components/Spinner.js";

export { Progress } from "./components/Progress.js";
export type { ProgressProps } from "./components/Progress.js";

export { Skeleton } from "./components/Skeleton.js";
export type { SkeletonProps } from "./components/Skeleton.js";

export { Empty } from "./components/Empty.js";
export type { EmptyProps } from "./components/Empty.js";

export { Stat } from "./components/Stat.js";
export type { StatProps } from "./components/Stat.js";

export { Toaster, createToaster } from "./components/Toast.js";
export type {
  ToasterProps,
  ToastController,
  ToastItem,
  ToastTone,
} from "./components/Toast.js";

// —— Navigation & structure ——
export { Tabs } from "./components/Tabs.js";
export type { TabsProps, TabItem } from "./components/Tabs.js";

export { Accordion } from "./components/Accordion.js";
export type { AccordionProps, AccordionItem } from "./components/Accordion.js";

export { Breadcrumb } from "./components/Breadcrumb.js";
export type { BreadcrumbProps, BreadcrumbItem } from "./components/Breadcrumb.js";

export { Pagination } from "./components/Pagination.js";
export type { PaginationProps } from "./components/Pagination.js";

export { Steps } from "./components/Steps.js";
export type { StepsProps, StepItem } from "./components/Steps.js";

export { Timeline } from "./components/Timeline.js";
export type { TimelineProps, TimelineItem } from "./components/Timeline.js";

export { List } from "./components/List.js";
export type { ListProps, ListItemData } from "./components/List.js";

export { Table } from "./components/Table.js";
export type { TableProps, TableColumn } from "./components/Table.js";

// —— Overlays ——
export { Dialog } from "./components/Dialog.js";
export type { DialogProps } from "./components/Dialog.js";

export { Drawer } from "./components/Drawer.js";
export type { DrawerProps } from "./components/Drawer.js";

export { Tooltip } from "./components/Tooltip.js";
export type { TooltipProps } from "./components/Tooltip.js";

export { Popover } from "./components/Popover.js";
export type { PopoverProps } from "./components/Popover.js";

export { Menu } from "./components/Menu.js";
export type { MenuProps, MenuItem } from "./components/Menu.js";

export { Command } from "./components/Command.js";
export type { CommandProps, CommandItem } from "./components/Command.js";

// —— Motion ——
export { Transition } from "./components/Transition.js";
export type { TransitionProps } from "./components/Transition.js";
