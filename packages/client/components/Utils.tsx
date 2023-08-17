import React from "react";
import { Box, Button } from "@mui/joy";

import * as MuiBtn from "@mui/joy/Button";

export function MuiButton(props: React.ComponentProps<typeof MuiBtn.default>) {
  return (
    <Button
      variant={props.variant}
      startDecorator={props.startDecorator}
      sx={{
        textTransform: "none",
        fontSize: "1rem",
        borderRadius: ".5rem",
        padding: ".25rem 1rem",
        ...props.sx,
      }}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
}

export function Container({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "0 1rem",
        marginTop: "4rem",
      }}
    >
      {children}
    </Box>
  );
}
