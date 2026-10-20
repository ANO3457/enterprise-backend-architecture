import { Worker, Job } from 'bullmq';
import { redisConnectionOptions } from '../config/redis';
import { emailDLQ, EmailJobPayload } from '../queues/email.queue';

export class QueueTriageWorker {
  public static initWorker(): Worker {
    const worker = new Worker<EmailJobPayload>(
      'email-tasks',
      async (job: Job<EmailJobPayload>) => {
        if (!job.data.to || !job.data.to.includes('@')) {
          // Unrecoverable poison pill format error
          throw new Error(`PoisonPillError: Invalid recipient email "${job.data.to}"`);
        }
        return { delivered: true, timestamp: Date.now() };
      },
      { connection: redisConnectionOptions }
    );

    // On maximum retries exhausted, safely move to Dead Letter Queue
    worker.on('failed', async (job, err) => {
      if (job && job.attemptsMade >= (job.opts.attempts || 3)) {
        await emailDLQ.add('dead-letter-triage', {
          originalJobId: job.id,
          payload: job.data,
          failedReason: err.message,
          quarantinedAt: new Date().toISOString()
        });
      }
    });

    return worker;
  }
}
