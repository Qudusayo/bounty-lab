import { Box } from "@mui/joy";
import { useColorScheme as useJoyColorScheme } from "@mui/joy/styles";
import CustomConnectBtn from "./CustomConnectBtn";
import ModeToggle from "./ModeToggle";
import { useEffect, useState } from "react";

export default function Header() {
  const { mode, setMode } = useJoyColorScheme();
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (mode === "light") {
      setIsLightMode(true);
    } else {
      setIsLightMode(false);
    }
  }, [mode]);

  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      px={2}
      py={1}
      borderBottom={"1px solid"}
      borderColor={isLightMode ? "neutral.200" : "neutral.700"}
      position={"sticky"}
      bgcolor={isLightMode ? "neutral.50" : "neutral.900"}
      top={0}
      zIndex={100}
    >
      <span>Bonafide</span>

      <Box display={"flex"} alignItems={"center"} gap={1}>
        <CustomConnectBtn />
        <ModeToggle />
      </Box>
    </Box>
  );
}
