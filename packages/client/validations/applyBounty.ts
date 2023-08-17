import * as Yup from "yup";

const ApplyBountyValidationSchema = Yup.object().shape({
  description: Yup.string().required("Description is required"),
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

export { ApplyBountyValidationSchema };
