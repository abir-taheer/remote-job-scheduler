import { send_email_verification_job } from "./send_email_verification";
import { Job } from "@/job";
export * from "./send_email_verification";

export const jobs_by_name: Record<string, Job<any>> = {
  send_email_verification: send_email_verification_job,
} as const;
