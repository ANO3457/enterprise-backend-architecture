import { Queue } from 'bullmq';
import { redisConnectionOptions } from '../config/redis';

export interface EmailJobPayload {
  to: string;
  subject: string;
  body: string;
}

// Resilient queue configuration preventing poison pills and infinite retry storms
export const emailQueue = new Queue<EmailJobPayload>('email-tasks', {
  connection: redisConnectionOptions,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: { count: 1000 },
    removeOnFail: false // Kept for DLQ triage
  }
});

export const emailDLQ = new Queue('email-tasks-dlq', {
  connection: redisConnectionOptions
});
