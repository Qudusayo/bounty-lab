import { extendTheme } from "@mui/joy/styles";

declare module "@mui/joy/styles" {
  interface PalettePrimaryOverrides {
    50: false;
  }
}

const joyTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          "100": "#dae4fd",
          "200": "#b4cafb",
          "300": "#90b0f9",
          "400": "#4a7bf7",
          "500": "#4a7bf7",
          "600": "#3b63c5",
          "700": "#2c4a94",
          "800": "#1d3162",
          "900": "#0e1931",
        },
        success: {},
      },
    },
    dark: {
      palette: {},
    },
  },
  fontFamily: {
    display: '"Work Sans", var(--joy-fontFamily-fallback)',
    body: '"Work Sans", var(--joy-fontFamily-fallback)',
  },
});

export default joyTheme;
