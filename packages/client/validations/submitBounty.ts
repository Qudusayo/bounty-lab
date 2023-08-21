import * as Yup from "yup";

const SubmitBountyValidationSchema = Yup.object().shape({
  description: Yup.string(),
  submissionURL: Yup.string()
    .required("Submission URL is required")
    .url("Submission URL must be a valid URL"),
});

export { SubmitBountyValidationSchema };
