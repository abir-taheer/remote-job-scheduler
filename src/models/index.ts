import { Schema, model, connect } from "mongoose";
const connection_string = process.env.JOB_SCHEDULER_MONGO_URL;

if (!connection_string) {
  throw new Error(
    "You need to set the JOB_SCHEDULER_MONGO_URL string variable"
  );
}

await connect(connection_string, {
  autoCreate: true,
  autoIndex: true,
});

export * from "./job_model";
