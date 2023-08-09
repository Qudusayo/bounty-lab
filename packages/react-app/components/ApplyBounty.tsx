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
import { CreateBountyValidationSchema } from "@/validations/createBounty";
import { FiUserPlus } from "react-icons/fi";
import { GrCheckmark } from "react-icons/gr";

export default function ApplyBounty() {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <React.Fragment>
      <Button
        variant="soft"
        onClick={() => setOpen(true)}
        startDecorator={<FiUserPlus size={20} />}
      >
        Apply
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
              Apply to work on Bounty
            </Typography>
            <Formik
              initialValues={{
                description: "",
                email: "",
              }}
              validationSchema={CreateBountyValidationSchema}
              onSubmit={(values, { setSubmitting }) => {
                console.log(JSON.stringify(values, null, 2));
                setSubmitting(false);
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
                setFieldValue,
              }) => (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <Typography level="body-sm">
                      Your application message will be publicly posted to this
                      Bounty. Your contact information will remain private and
                      is only shared with the Bounty Poster. Check out the
                      Bounty Hunter docs for tips on creating a good application
                    </Typography>
                    <Box
                      sx={{
                        border: "1px solid",
                        borderColor: "neutral.200",
                        borderRadius: "0.25rem",
                        p: 1,
                        my: 2,
                      }}
                    >
                      <Typography display={"inline"}>
                        Complete bounty to earn{" "}
                      </Typography>
                      <Typography color="success" display={"inline"}>
                        $1000.00
                      </Typography>
                    </Box>
                    <FormControl>
                      <FormLabel
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        Application Message:{" "}
                        <Chip size="sm" color="neutral" variant="soft">
                          Public
                        </Chip>
                      </FormLabel>
                      <Textarea
                        placeholder="Explain why you're the best candidate to work on this bounty. Showcase relevant past works and experience."
                        value={values.description}
                        onChange={handleChange}
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
                        Your email:{" "}
                        <Chip size="sm" color="neutral" variant="soft">
                          Private
                        </Chip>
                      </FormLabel>
                      <Input
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        name="email"
                      />
                      {touched.email && errors.email && (
                        <Typography fontSize={"sm"} color="danger">
                          {errors.email}
                        </Typography>
                      )}
                    </FormControl>

                    <Typography level="body-xs">
                      By applying, you agree to the Terms. You confirm
                      you&apos;ll either produce the code yourself or use code
                      you have rights to. Rights to the work transfer to the
                      Bounty Poster upon transfer of Cycles after acceptance.
                    </Typography>

                    <Button startDecorator={<GrCheckmark stroke="#fff" />} type="submit">
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
