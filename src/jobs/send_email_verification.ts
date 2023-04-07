import { Job, JobParams } from "@/job";

export interface SendEmailVerificationProps extends JobParams {
  email: string;
  user_id: string;
}

export const send_email_verification_job = new Job<SendEmailVerificationProps>({
  name: "send_email_verification",
  execute_handler: (params) => {},
  error_handler: () => {},
});
