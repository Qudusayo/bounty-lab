import * as React from "react";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import { BsFillPersonXFill, BsThreeDotsVertical } from "react-icons/bs";
import { useAppContext } from "@/context/AppContext";
import {
  Box,
  Button,
  Dropdown,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  Typography,
} from "@mui/joy";

export default function AbandonBounty({
  bountyId,
  refetchBounty,
}: {
  bountyId: string;
  refetchBounty: (backToDetails: boolean) => void;
}) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [droppingBounty, setDroppingBounty] = React.useState<boolean>(false);
  const { abandonBounty } = useAppContext();

  return (
    <React.Fragment>
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: "solid", color: "neutral" } }}
        >
          <BsThreeDotsVertical />
        </MenuButton>
        <Menu placement="bottom-start" variant="soft">
          <MenuItem onClick={() => setOpen(true)}>
            <Typography startDecorator={<BsFillPersonXFill />} color="danger">
              Abandon Bounty
            </Typography>
          </MenuItem>
        </Menu>
      </Dropdown>
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
            Abandon this Bounty?
          </Typography>
          <Divider />
          <Typography
            id="alert-dialog-modal-description"
            textColor="text.tertiary"
          >
            If you abandon this Bounty, the Bounty will be reopened so a new
            hunter can be selected.
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
              color="danger"
              startDecorator={<BsFillPersonXFill />}
              onClick={async () => {
                setDroppingBounty(true);
                try {
                  await abandonBounty(bountyId);
                  refetchBounty(true);
                } catch (error) {
                } finally {
                  setDroppingBounty(false);
                  setOpen(false);
                }
              }}
              loading={droppingBounty}
              disabled={droppingBounty}
            >
              Abandon Bounty
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
}
