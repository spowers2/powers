import { mount } from "@lab206/dom";
import { installDevWarnings } from "@lab206/ui";
import "@lab206/ui/theme.css";
import "./styles.css";
import { bootstrapTheme, createApp } from "./App.js";

installDevWarnings();

const { theme, density, toaster } = bootstrapTheme();
const { Shell } = createApp({ theme, density, toaster });

const root = document.getElementById("root");
if (!root) throw new Error("#root missing");

mount(root, () => <Shell />);
