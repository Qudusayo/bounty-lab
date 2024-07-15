import * as Yup from "yup";

const CreateBountyValidationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  targetCompletionDate: Yup.date().required(
    "Target completion date is required"
  ),
  description: Yup.string().required("Description is required"),
  amount: Yup.number()
    .required("Minimum bounty of 1 cUSD")
    .min(1, "Minimum bounty of 1 cUSD")
    .typeError("Minimum bounty of 1 cUSD"),
  communicationMethod: Yup.object().shape({
    type: Yup.mixed()
      .oneOf(["email", "discord"])
      .required("Communication type is required"),
    value: Yup.string().when("type", {
      is: (type: "email" | "discord") => type === "email",
      then: (schema) =>
        schema.email("Invalid email format").required("Email is required"),
      otherwise: (schema) => schema.required("Username is required"),
    }),
  }),
});

export { CreateBountyValidationSchema };
