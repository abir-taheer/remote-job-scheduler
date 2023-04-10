import { Types } from "mongoose";
import { job_model } from "@/models";

export type ScalarValue = string | boolean | number | Date | null;

export enum JobStatus {
  Failed = "failed",
  Succeeded = "succeeded",
  NotStarted = "not_started",
  InProgress = "in_progress",
}

export type JobParams = {
  [key: string]: ScalarValue | JobParams;
};

export type ExecutionContext = {
  job_id: Types.ObjectId;
  job_name: string;
  started_at: Date;
};

export type ExecuteHandlerFn<Params extends JobParams> = (
  params: Params,
  context: ExecutionContext
) => void;

export type ErrorHandlerFn<Params extends JobParams> = (
  error: Error,
  params: Params,
  context: ExecutionContext
) => void;

export type JobOptions = {
  execute_after?: Date;
};

export type ScheduleFn<Params extends JobParams> = (
  params: Params,
  options?: JobOptions
) => Promise<Types.ObjectId>;

export type JobConstructorParams<Params extends JobParams> = {
  name: string;
  execute_handler: ExecuteHandlerFn<Params>;
  error_handler: ErrorHandlerFn<Params>;
};
export class Job<Params extends JobParams> {
  name: string;
  execute_handler: ExecuteHandlerFn<Params>;
  error_handler: ErrorHandlerFn<Params>;
  constructor(params: JobConstructorParams<Params>) {
    this.name = params.name;
    this.execute_handler = params.execute_handler;
    this.error_handler = params.error_handler;
  }

  schedule: ScheduleFn<Params> = async (params, options) => {
    const job = await job_model.create({
      name: this.name,
      status: JobStatus.NotStarted,
      params,
      options,
    });

    return job._id;
  };
}
