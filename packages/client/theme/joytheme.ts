import { extendTheme } from "@mui/joy/styles";

// declare module "@mui/joy/styles" {
//   interface PalettePrimaryOverrides {
//     50: false;
//   }
// }

const joyTheme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {},
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
