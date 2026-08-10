/**
 * @power-ui/ui — integrated design system (styling + components)
 *
 * Layers: tokens → primitives → optional utilities (see docs/STYLING.md)
 *
 * 1. import "@power-ui/ui/theme.css"   // tokens + base + utilities
 * 2. createTheme().bind(); createDensity().bind();
 * 3. Use Button, Field, Stack… (prefer primitives over raw utilities)
 *
 * Edit brand in: packages/ui/src/styles/tokens.css
 * Public docs hub: docs/README.md
 */

export { createTheme } from "./theme.js";
export type { ThemeMode, ThemeController } from "./theme.js";

export { createDensity } from "./density.js";
export type { Density, DensityController } from "./density.js";

export { cx } from "./utils.js";

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

export { Stack } from "./components/Stack.js";
export type { StackProps } from "./components/Stack.js";

export { Text } from "./components/Text.js";
export type { TextProps } from "./components/Text.js";

export { Card } from "./components/Card.js";
export type { CardProps } from "./components/Card.js";

export { Badge } from "./components/Badge.js";
export type { BadgeProps } from "./components/Badge.js";

export { Container } from "./components/Container.js";
export type { ContainerProps } from "./components/Container.js";

export { Grid } from "./components/Grid.js";
export type { GridProps } from "./components/Grid.js";

export { Code } from "./components/Code.js";
export type { CodeProps } from "./components/Code.js";

export { Alert } from "./components/Alert.js";
export type { AlertProps, AlertTone } from "./components/Alert.js";

export { Divider } from "./components/Divider.js";
export type { DividerProps } from "./components/Divider.js";

export { Spinner } from "./components/Spinner.js";
export type { SpinnerProps, SpinnerSize } from "./components/Spinner.js";
