import * as React from "react";
import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import { useColorScheme as useMaterialColorScheme } from "@mui/material/styles";
import { IconButton } from "@mui/joy";

// Icons
import { BiSolidMoon } from "react-icons/bi";
import { BsSunFill } from "react-icons/bs";

const ModeToggle = () => {
  const { mode, setMode } = useMaterialColorScheme();
  const { setMode: setJoyMode } = useJoyColorScheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    // prevent server-side rendering mismatch
    // because `mode` is undefined on the server.
    return null;
  }
  return (
    <IconButton
      variant="soft"
      onClick={() => {
        setMode(mode === "dark" ? "light" : "dark");
        setJoyMode(mode === "dark" ? "light" : "dark");
      }}
    >
      {/** You can use `mode` from Joy UI or Material UI since they are synced **/}
      {mode === "dark" ? <BiSolidMoon /> : <BsSunFill />}
    </IconButton>
  );
};

export default ModeToggle;
