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
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 9C4 11.9611 5.60879 14.5465 8 15.9297V15.9999C8 18.2091 9.79086 19.9999 12 19.9999C14.2091 19.9999 16 18.2091 16 15.9999V15.9297C18.3912 14.5465 20 11.9611 20 9C20 4.58172 16.4183 1 12 1C7.58172 1 4 4.58172 4 9ZM16 13.4722C17.2275 12.3736 18 10.777 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 10.777 6.7725 12.3736 8 13.4722L10 13.4713V16C10 17.1045 10.8954 17.9999 12 17.9999C13.1045 17.9999 14 17.1045 14 15.9999V13.4713L16 13.4722Z"
          fill="#1EA896"
        />
        <path
          d="M10 21.0064V21C10.5883 21.3403 11.2714 21.5351 12 21.5351C12.7286 21.5351 13.4117 21.3403 14 21V21.0064C14 22.111 13.1046 23.0064 12 23.0064C10.8954 23.0064 10 22.111 10 21.0064Z"
          fill="#1EA896"
        />
      </svg>

      <Box display={"flex"} alignItems={"center"} gap={1}>
        <CustomConnectBtn />
        <ModeToggle />
      </Box>
    </Box>
  );
}
