import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { ModalOverflow, Textarea } from "@mui/joy";
import { Formik } from "formik";
import { useAppContext } from "@/context/AppContext";
import { BsArrowRepeat } from "react-icons/bs";
import * as Yup from "yup";

interface ApplyBountyProps {
  bountyId: string;
  refetchBounty: () => void;
}

export default function RequestChages(bounty: ApplyBountyProps) {
  const { address, requestChanges } = useAppContext();
  const [open, setOpen] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Button
        size="sm"
        variant="soft"
        color="neutral"
        startDecorator={<BsArrowRepeat />}
        onClick={() => setOpen(true)}
      >
        Request Changes
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalOverflow>
          <ModalDialog
            aria-labelledby="basic-modal-dialog-title"
            aria-describedby="basic-modal-dialog-description"
            sx={{
              maxWidth: 600,
              width: "95%",
            }}
          >
            <Typography id="basic-modal-dialog-title" level="title-lg">
              Request Changes
            </Typography>
            <Formik
              initialValues={{
                description: "",
              }}
              validationSchema={Yup.object().shape({
                description: Yup.string()
                  .min(10, "Must be at least 10 characters")
                  .required("Required"),
              })}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);

                try {
                  let requestChange = await requestChanges(
                    bounty.bountyId,
                    values.description
                  );
                  //@ts-ignore
                  if (requestChange.success) {
                    resetForm();
                    bounty.refetchBounty();
                    setOpen(false);
                  }
                } catch (error) {
                  console.log(error);
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <Typography level="body-sm" sx={{ my: 6 }}>
                      To reject a submission you must provide sufficient
                      reasoning as to why this contribution did not fulfill your
                      task.
                    </Typography>

                    <FormControl>
                      <FormLabel
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        Reason for rejecting
                      </FormLabel>
                      <Textarea
                        placeholder="Explain why you're not satisfied with the deliverable."
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="description"
                        minRows={5}
                        maxRows={5}
                      />
                      {touched.description && errors.description && (
                        <Typography fontSize={"sm"} color="danger">
                          {errors.description}
                        </Typography>
                      )}
                    </FormControl>
                    <Typography level="body-sm">
                      The hunter will be notified of your reasoning and be able
                      to resubmit their work.
                    </Typography>

                    <Button
                      startDecorator={
                        !isSubmitting && <BsArrowRepeat fill="#fff" />
                      }
                      type="submit"
                      variant="solid"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                    >
                      Request Changes
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
          </ModalDialog>
        </ModalOverflow>
      </Modal>
    </React.Fragment>
  );
}
