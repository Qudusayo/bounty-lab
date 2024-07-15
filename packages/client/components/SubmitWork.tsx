import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { Box, Chip, ModalOverflow, Textarea } from "@mui/joy";
import { Formik } from "formik";
import { SubmitBountyValidationSchema } from "@/validations";
import { TbWorldUpload } from "react-icons/tb";
import { GrCheckmark } from "react-icons/gr";
import { useAppContext } from "@/context/AppContext";
import { handleUpload } from "@/functions";
import { useBountyHandler } from "@/hooks/useBountyHandler";
import { useBountyDetail } from "@/hooks/useBountyDetail";

interface ApplyBountyProps {
  bountyId: `0x${string}`;
  refetchBounty: () => void;
}

export default function SubmitWork(bounty: ApplyBountyProps) {
  const { address } = useAppContext();
  const [open, setOpen] = React.useState<boolean>(false);
  const { submitWork } = useBountyHandler(bounty.bountyId);
  const { refreshBountyData } = useBountyDetail(bounty.bountyId);

  return (
    <React.Fragment>
      <Button
        onClick={() => setOpen(true)}
        startDecorator={<TbWorldUpload size={20} />}
      >
        Submit Work
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
              Submit Work
            </Typography>
            <Formik
              initialValues={{
                description: "",
                submissionURL: "",
              }}
              validationSchema={SubmitBountyValidationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);

                try {
                  let submissionDetailIPFSHash = (
                    await handleUpload(
                      JSON.stringify({
                        description: values.description,
                        submissionURL: values.submissionURL,
                      })
                    )
                  ).toString();
                  let submission = await submitWork(
                    submissionDetailIPFSHash,
                    false,
                    true
                  );

                  if (submission) {
                    resetForm();
                    refreshBountyData();
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
                      When you submit your work, the host will be able to review
                      your submission.
                    </Typography>

                    <FormControl>
                      <FormLabel
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        Submission Description
                        <Chip size="sm" color="neutral" variant="soft">
                          Optional
                        </Chip>
                      </FormLabel>
                      <Textarea
                        placeholder="Your submission description"
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
                    <FormControl>
                      <FormLabel
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        Submission Link
                      </FormLabel>
                      <Input
                        placeholder=""
                        name="submissionURL"
                        value={values.submissionURL}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {touched.submissionURL && errors.submissionURL && (
                        <Typography fontSize={"sm"} color="danger">
                          {errors.submissionURL}
                        </Typography>
                      )}
                    </FormControl>

                    <Typography level="body-sm">
                      By submitting, you agree to the Terms where you certify
                      that you own or have the right to use content and code you
                      create on Replit and will comply with the law.
                    </Typography>
                    <Typography level="body-sm">
                      Rights in the code you create will transfer from you to
                      the Bounty Poster later.
                    </Typography>

                    <Button
                      startDecorator={
                        !isSubmitting && <GrCheckmark fill="#fff" />
                      }
                      type="submit"
                      variant="solid"
                      disabled={isSubmitting}
                      loading={isSubmitting}
                    >
                      Submit
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
