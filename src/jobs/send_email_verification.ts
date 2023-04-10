// This file is an example for creating jobs with this microservice
import { Job, JobParams } from "@/job";

export interface SendEmailVerificationProps extends JobParams {
  email: string;
  user_id: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const send_email_verification_job = new Job<SendEmailVerificationProps>({
  // This name uniquely identifies the current remote job
  name: "send_email_verification",

  // This is the core logic for the remote job
  // This function will be called once the job runs
  execute_handler: async (params, context) => {
    await sleep(5000);
  },

  // This function will be called in the following situations:
  //   - The execute_handler function threw an error
  //   - The execute_handler function returned a promise that was eventually rejected
  error_handler: (error, params, context) => {},
});

/*
In your project if you want to use this remote job you would do the following

```
import { send_email_verification_job } from "@/remote-jobs";

const job_id = await send_email_verification_job.schedule({
  email: "john@example.com",
  user_id: "1234567890"
});

```
 */
