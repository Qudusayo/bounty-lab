import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/joy/Typography";
import { MuiButton } from "./Utils";
import { BsPlusLg } from "react-icons/bs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {
  Divider,
  Grid,
  ModalOverflow,
  Select,
  Table,
  Textarea,
} from "@mui/joy";
import { selectClasses } from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { SlArrowDown } from "react-icons/sl";
import { Formik } from "formik";
import { CreateBountyValidationSchema } from "@/validations/createBounty";

const threeDaysTime = dayjs().add(3, "day");

export default function CreateBounty() {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <React.Fragment>
      <MuiButton
        onClick={() => setOpen(true)}
        startDecorator={<BsPlusLg />}
        sx={{
          width: ["100%", "100%", "auto"],
          my: [2, 2, "0"],
        }}
        variant="solid"
      >
        Create a Bounty
      </MuiButton>
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
            <Typography id="basic-modal-dialog-title" level="h2">
              Create a bounty
            </Typography>
            <Formik
              initialValues={{
                title: "",
                targetCompletionDate: threeDaysTime,
                description: `# Problem Description

# Acceptance Criteria

# Technical Details

# Timelines / Milestones
`,
                amount: 1500,
                communicationMethod: {
                  type: "email" as "email" | "discord",
                  value: "",
                },
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
                /* and other goodies */
              }) => (
                <form onSubmit={handleSubmit}>
                  <Stack spacing={2}>
                    <FormControl>
                      <FormLabel>Bounty Title</FormLabel>
                      <Input
                        autoFocus
                        value={values.title}
                        name="title"
                        onChange={handleChange}
                      />
                      {touched.title && errors.title && (
                        <Typography fontSize={"sm"} color="danger">
                          {errors.title}
                        </Typography>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel>Target Completion Date</FormLabel>
                      <DatePicker
                        defaultValue={values.targetCompletionDate}
                        disablePast
                        views={["year", "month", "day"]}
                        sx={{
                          "& input": {
                            py: 1,
                            fontSize: "sm",
                          },
                        }}
                        onChange={(date) => {
                          setFieldValue("targetCompletionDate", date);
                        }}
                      />
                    </FormControl>
                    <Grid
                      container
                      rowSpacing={[2, 2, 1]}
                      columnSpacing={{ xs: 0, sm: 0, md: 2 }}
                      sx={{ width: "100%" }}
                    >
                      <Grid xs={12} md={6} pl={0}>
                        <FormLabel>Communication Method</FormLabel>
                        <Select
                          placeholder="Communication Method"
                          indicator={<SlArrowDown size={12} />}
                          sx={{
                            width: "100%",
                            [`& .${selectClasses.indicator}`]: {
                              transition: "0.2s",
                              [`&.${selectClasses.expanded}`]: {
                                transform: "rotate(-180deg)",
                              },
                            },
                          }}
                          name="communicationMethod"
                          value={values.communicationMethod.type}
                          onChange={(_, value) => {
                            setFieldValue("communicationMethod", {
                              type: value,
                              value: "",
                            });
                          }}
                        >
                          <Option value="email">Email</Option>
                          <Option value="discord">Discord</Option>
                        </Select>
                      </Grid>
                      <Grid xs={12} md={6} pr={0}>
                        <FormLabel>
                          {values.communicationMethod.type === "email"
                            ? "Email"
                            : "Discord username"}
                        </FormLabel>
                        <Input
                          placeholder={
                            values.communicationMethod.type === "email"
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
                      </Grid>
                    </Grid>
                    <FormControl>
                      <FormLabel>Description</FormLabel>
                      <Textarea
                        placeholder="Be specific about what you want in the solution."
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
                      <FormLabel>Bounty Amount</FormLabel>
                      <Input
                        type="number"
                        slotProps={{
                          input: {
                            // ref: inputRef,
                            min: 0,
                            max: 10000,
                            step: 1,
                          },
                        }}
                        startDecorator="$"
                        value={values.amount}
                        onChange={(e) => {
                          setFieldValue("amount", Number(e.target.value));
                        }}
                        name="amount"
                      />
                      {touched.amount && errors.amount && (
                        <Typography fontSize={"sm"} color="danger">
                          {errors.amount}
                        </Typography>
                      )}
                    </FormControl>

                    <Table
                      aria-label="table"
                      borderAxis="xBetween"
                      sx={{ mx: "auto", maxWidth: 300 }}
                    >
                      <tbody>
                        <tr style={{ display: "flex", width: "100%" }}>
                          <td
                            style={{
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "11rem",
                            }}
                          >
                            <Typography noWrap>Solver Payout</Typography>
                          </td>
                          <td>
                            <Typography level="body-sm">
                              ${(0.9 * values.amount).toFixed(2)}
                            </Typography>
                          </td>
                        </tr>
                        <tr style={{ display: "flex", width: "100%" }}>
                          <td
                            style={{
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "11rem",
                            }}
                          >
                            <Typography noWrap>
                              Bounty Marketplace Fee
                            </Typography>
                          </td>
                          <td>
                            <Typography noWrap>
                              ${(0.1 * values.amount).toFixed(2)}
                            </Typography>
                          </td>
                        </tr>
                        <tr style={{ display: "flex", width: "100%" }}>
                          <td
                            style={{
                              flex: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              width: "11rem",
                            }}
                          >
                            <Typography noWrap>Bounty Amount</Typography>
                          </td>
                          <td>
                            <Typography noWrap>
                              ${values.amount.toFixed(2)}
                            </Typography>
                          </td>
                        </tr>
                      </tbody>
                    </Table>

                    <Divider />
                    <Typography level="body-xs">
                      By posting a Bounty, you agree to the Terms. You&apos;ll
                      get rights to the work when Cycles transfer after
                      completion.
                    </Typography>

                    <Button type="submit">Submit</Button>
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
