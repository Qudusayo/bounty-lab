import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { Avatar, Button, Typography } from "@mui/joy";

import * as React from "react";
import IconButton from "@mui/joy/IconButton";
import Menu from "@mui/joy/Menu";
import MenuItem from "@mui/joy/MenuItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListDivider from "@mui/joy/ListDivider";
import MenuButton from "@mui/joy/MenuButton";
import Dropdown from "@mui/joy/Dropdown";
import { LuLogOut } from "react-icons/lu";

export default function CustomConnectBtn() {
  const { disconnectAsync } = useDisconnect();
  // const { push } = useRouter();
  const [anchorEl, setAnchorEl] = useState<
    HTMLButtonElement | HTMLAnchorElement | null
  >(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const shortenAddress = (add: string) =>
    !!add
      ? (
          add.slice(0, 5) +
          "..." +
          add.slice(add.length - 4, add.length)
        ).toLowerCase()
      : "";

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");
        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} type="secondary">
                    Connect Wallet
                  </Button>
                );
              }
              return (
                <Dropdown>
                  <MenuButton
                    slots={{ root: IconButton }}
                    slotProps={{ root: { variant: "plain", color: "neutral" } }}
                    sx={{
                      borderRadius: 40,
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <Avatar size="md" sx={{
                      borderRadius: "md",
                    }} />
                  </MenuButton>
                  <Menu placement="bottom-end">
                    <MenuItem
                      disabled
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                      }}
                    >
                      <Typography level="body-sm">Account</Typography>
                      <Typography level="body-md">
                        {shortenAddress(account.address)}
                      </Typography>
                    </MenuItem>
                    <ListDivider />
                    <MenuItem
                      variant="soft"
                      color="danger"
                      onClick={() => {
                        handleClose();
                        disconnectAsync();
                      }}
                    >
                      <ListItemDecorator sx={{ color: "inherit" }}>
                        <LuLogOut />
                      </ListItemDecorator>
                      Disconnect
                    </MenuItem>
                  </Menu>
                </Dropdown>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
