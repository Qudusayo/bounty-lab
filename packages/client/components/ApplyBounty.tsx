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
import { ApplyBountyValidationSchema } from "@/validations";
import { FiUserPlus } from "react-icons/fi";
import { GrCheckmark } from "react-icons/gr";
import { Bounty, BountyApplication } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { handleUpload } from "@/functions";

const { format } = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface ApplyBountyProps extends Bounty {
  bountyId: string;
  refetchBounty: () => void;
}

export default function ApplyBounty(bounty: ApplyBountyProps) {
  let { reward, communication, applications } = bounty;
  const { address, applyToBounty } = useAppContext();
  const [open, setOpen] = React.useState<boolean>(false);
  const [hasAppliedToBounty, setHasAppliedToBounty] = React.useState(false);

  React.useEffect(() => {
    setHasAppliedToBounty(
      applications?.some((item) => item.hunter === address) || false
    );
  }, [applications, address]);

  return (
    <React.Fragment>
      <Button
        onClick={() => setOpen(true)}
        startDecorator={<FiUserPlus size={20} />}
        disabled={hasAppliedToBounty}
      >
        {hasAppliedToBounty ? "Already Applied" : "Apply"}
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
                communicationMethod: {
                  type: communication.method,
                  value: "",
                },
              }}
              validationSchema={ApplyBountyValidationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                setSubmitting(true);
                let applicationMessageIPFSHash = await handleUpload(
                  values.description
                );

                try {
                  setSubmitting(true);
                  let bountyApplicationData: BountyApplication = {
                    hunter: address!,
                    status: "open",
                    timestamp: Date.now(),
                    applicationMessage: applicationMessageIPFSHash.toString(),
                    communication: {
                      method: communication.method,
                      value: values.communicationMethod.value,
                    },
                  };
                  await applyToBounty(
                    bounty.bountyId,
                    bountyApplicationData,
                    bounty.txId
                  );
                  setOpen(false);
                  resetForm();
                  bounty.refetchBounty();
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
                        ${reward}{" "}
                      </Typography>
                      <Typography
                        display={"inline"}
                        level="body-sm"
                        fontWeight={"bold"}
                      >
                        10% Fee ${(0.1 * reward).toFixed(2)} Charged
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
                        Your{" "}
                        {communication.method === "email"
                          ? "Email"
                          : "Discord username"}
                        <Chip size="sm" color="neutral" variant="soft">
                          Private
                        </Chip>
                      </FormLabel>
                      <Input
                        placeholder={
                          communication.method === "email"
                            ? "user@email.com"
                            : "Username#1234"
                        }
                        name="communicationMethod.value"
                        value={values.communicationMethod.value}
                        onChange={(e) => {
                          setFieldValue(
                            "communicationMethod.value",
                            e.target.value
                          );
                        }}
                      />
                      {touched.communicationMethod?.value &&
                        errors.communicationMethod?.value && (
                          <Typography fontSize={"sm"} color="danger">
                            {errors.communicationMethod?.value}
                          </Typography>
                        )}
                    </FormControl>

                    <Typography level="body-xs">
                      By applying, you agree to the Terms. You confirm
                      you&apos;ll either produce the code yourself or use code
                      you have rights to. Rights to the work transfer to the
                      Bounty Poster upon transfer of Cycles after acceptance.
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
