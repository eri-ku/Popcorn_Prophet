import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "@mantine/core/styles.css";
import { Input } from "@mantine/core";
import input from "./inputFocus.module.css";
import "@mantine/dates/styles.css";
import "@mantine/carousel/styles.css";
import {
  MantineProvider,
  CSSVariablesResolver,
  createTheme,
} from "@mantine/core";
import "@mantine/notifications/styles.css";
import { Notifications } from "@mantine/notifications";

const theme = createTheme({
  primaryColor: "red",
  primaryShade: 7,
  fontFamily: "Montserrat, sans-serif",
  scale: 1.6,
  components: {
    Input: Input.extend({
      classNames: {
        input: input.input,
      },
    }),
  },
});

const resolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: { "--mantine-color-text": theme.colors.gray[9] },
  dark: { "--mantine-color-text": theme.colors.red[1] },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider
      defaultColorScheme="dark"
      cssVariablesResolver={resolver}
      theme={theme}
    >
      <Notifications />
      <App />
    </MantineProvider>
  </React.StrictMode>
);
