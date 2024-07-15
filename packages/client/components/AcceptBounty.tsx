import * as React from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import { BsCheck2 } from "react-icons/bs";
import { shortenAddress } from "@/functions";
import { useBountyHandler } from "@/hooks/useBountyHandler";
import { useBountyDetail } from "@/hooks/useBountyDetail";

export default function AcceptSubmission({
  bountyId,
  refetchBounty,
  hunter,
}: {
  bountyId: `0x${string}`;
  refetchBounty: () => void;
  hunter: `0x${string}`;
}) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [acceptingSubmission, setAcceptingSubmission] =
    React.useState<boolean>(false);
  const { acceptSubmission } = useBountyHandler(bountyId);
  const { refreshBountyData } = useBountyDetail(bountyId);

  return (
    <React.Fragment>
      <Button
        size="sm"
        variant="soft"
        color="neutral"
        startDecorator={<BsCheck2 />}
        onClick={() => setOpen(true)}
      >
        Accept Submission
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          variant="outlined"
          role="alertdialog"
          aria-labelledby="alert-dialog-modal-title"
          aria-describedby="alert-dialog-modal-description"
          sx={{
            maxWidth: 600,
            width: "95%",
          }}
        >
          <Typography id="alert-dialog-modal-title" level="h2">
            Accept Submission
          </Typography>
          <Divider />
          <Typography
            id="alert-dialog-modal-description"
            textColor="text.tertiary"
          >
            Once a submission is approved, your rewards will be released to{" "}
            {shortenAddress(hunter)}
          </Typography>
          <Box
            sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 2 }}
          >
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="solid"
              color="primary"
              startDecorator={<BsCheck2 />}
              onClick={async () => {
                setAcceptingSubmission(true);
                try {
                  await acceptSubmission();
                  refreshBountyData();
                } catch (error) {
                } finally {
                  setAcceptingSubmission(false);
                  setOpen(false);
                }
              }}
              loading={acceptingSubmission}
              disabled={acceptingSubmission}
            >
              Accept Submission
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
