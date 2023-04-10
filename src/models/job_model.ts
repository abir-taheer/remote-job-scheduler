import { model, Schema } from "mongoose";
import { JobParams, JobStatus } from "@/job";

type Nullable<Type> = null | Type;

export type IJobOptions = {
  execute_after: Date;
};

export type IJob = {
  name: string;
  params: JobParams;
  status: string;
  options: IJobOptions;

  started_at: Nullable<Date>;
  succeeded_at: Nullable<Date>;
  failed_at: Nullable<Date>;
};

const job_options_schema = new Schema<IJobOptions>({
  execute_after: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

const job_schema = new Schema<IJob>(
  {
    name: {
      type: String,
      required: true,
    },
    params: {
      type: Schema.Types.Mixed,
    },
    status: {
      type: String,
      enum: Object.values(JobStatus),
      default: JobStatus.NotStarted,
    },
    options: job_options_schema,
    started_at: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export const job_model = model<IJob>("job") || model<IJob>("job", job_schema);
