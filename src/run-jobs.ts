import { job_model, JobModelInstance } from "@/models";
import { jobs_by_name } from "@/jobs";
import { queue } from "async";
import { JobStatus } from "@/job";
import { sleep } from "@/utils/sleep";

type JobHandler = (job: JobModelInstance) => void;

const job_handler: JobHandler = async (job) => {
  // Record the fact that we started running the job as well as the time it started
  const started_at = new Date();
  job.overwrite({
    status: JobStatus.InProgress,
    started_at,
  });
  await job.save();

  const job_class = jobs_by_name[job.name];

  // The job doesn't exist for some reason
  if (!job_class) {
    job.overwrite({
      status: JobStatus.Failed,
      failed_at: new Date(),
    });
    await job.save();

    throw new Error("Unknown job name");
  }

  const context = {
    job_id: job._id,
    job_name: job.name,
    started_at,
  };

  try {
    await job_class.execute_handler(job.params, context);

    const succeeded_at = new Date();
    job.overwrite({
      status: JobStatus.Succeeded,
      succeeded_at,
    });
    await job.save();
  } catch (error: any) {
    const failed_at = new Date();
    job.overwrite({
      status: JobStatus.Failed,
      failed_at,
    });
    await job.save();

    await job_class.error_handler(error, job.params, context);
  }
};

const max_execution_concurrency = 5;
const job_queue = queue(job_handler, max_execution_concurrency);

let last_checked_date = null;

while (true) {
  let query = job_model.find().where("status", JobStatus.NotStarted);

  if (last_checked_date) {
    query = query.where("createdAt").gte(last_checked_date.getTime());
  }
  last_checked_date = new Date();

  const results = await query.exec();

  // Add all the jobs to the queue
  await Promise.all(results.map((job) => job_queue.push(job)));

  console.log("added", results.length, "jobs to the queue");

  // Wait 5 seconds before looking for incomplete jobs again
  await sleep(5000);
}
