/**
 * @power-ui/ui — design system
 *
 * 1. Import styles once:
 *      import "@power-ui/ui/theme.css"
 * 2. Optional theme:
 *      const theme = createTheme("dark"); theme.bind();
 * 3. Use primitives: Button, Input, Stack, Text, Card
 *
 * Edit look & feel in: packages/ui/src/styles/tokens.css
 */

export { createTheme } from "./theme.js";
export type { ThemeMode, ThemeController } from "./theme.js";
export { cx } from "./utils.js";

export { Button } from "./components/Button.js";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./components/Button.js";

export { Input } from "./components/Input.js";
export type { InputProps } from "./components/Input.js";

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
