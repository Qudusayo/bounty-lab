import * as React from "react";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import { TbBrandStackshare } from "react-icons/tb";
import { Box, Link } from "@mui/joy";
import { FiCopy } from "react-icons/fi";
import { useRouter } from "next/router";

export default function ShareModal({
  title,
  reward,
}: {
  title: string;
  reward: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const [origin, setOrigin] = React.useState("");

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  return (
    <React.Fragment>
      <Button
        sx={{ p: 1.25 }}
        color="neutral"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <TbBrandStackshare size={20} />
      </Button>

      <Modal open={isOpen} onClose={() => setIsOpen(false)}>
        <ModalDialog
          aria-labelledby="layout-modal-title"
          aria-describedby="layout-modal-description"
          sx={{
            maxWidth: 600,
            width: "95%",
          }}
        >
          <ModalClose />
          <Typography id="layout-modal-title" level="h2">
            Share this bounty
          </Typography>
          <Typography id="layout-modal-description" textColor="text.tertiary">
            This Bounty &ldquo;{title}&rdquo; is live and ready to be shared!
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              justifyContent: "flex-end",
            }}
          >
            <Button
              color="neutral"
              size="sm"
              startDecorator={<FiCopy />}
              onClick={() => {
                navigator.clipboard.writeText(origin + router.asPath);
              }}
            >
              Copy Link
            </Button>
            <Link
              // size="sm"
              sx={{
                bgcolor: "neutral.100",
                color: "neutral.500",
                py: 0.65,
                px: 1.25,
                fontSize: "14px",
                borderRadius: "4px",
                textDecoration: "none",

                "&:hover": {
                  textDecoration: "none",
                  bgcolor: "neutral.200",
                },
              }}
              rel="noopener"
              href={`https://x.com/share?text=Check out this Bounty, "${title}"- apply for it and earn ${reward} CUSD for completing it&url=${
                origin + router.asPath
              }`}
              target="_blank"
              variant="solid"
              endDecorator={
                <Box
                  sx={{
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <IconX />
                </Box>
              }
            >
              Share on
            </Link>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}

const IconX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
