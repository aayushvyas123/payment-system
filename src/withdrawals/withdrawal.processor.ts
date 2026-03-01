import { Process, Processor, OnQueueFailed } from '@nestjs/bull';
import type { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { Types } from 'mongoose';
import { WithdrawalRepository } from './withdrawal.repository';
import { WithdrawalStatus } from './enums/withdrawal-status.enum';

export interface WithdrawalJobData {
    withdrawalId: string;
}

@Injectable()
@Processor('withdrawals')
export class WithdrawalProcessor {
    private readonly logger = new Logger(WithdrawalProcessor.name);

    constructor(private readonly withdrawalRepo: WithdrawalRepository) {}

    @Process('process-withdrawal')
    async handleWithdrawal(job: Job<WithdrawalJobData>) {
        const { withdrawalId } = job.data;
        const wdId = new Types.ObjectId(withdrawalId);

        const withdrawal = await this.withdrawalRepo.findById(wdId);
        if (!withdrawal || withdrawal.status !== WithdrawalStatus.PENDING) return;

        const processing = await this.withdrawalRepo.updateStatus(wdId, withdrawal.version, WithdrawalStatus.PROCESSING);
        if (!processing) return;

        await this.withdrawalRepo.updateStatus(wdId, processing.version, WithdrawalStatus.SUCCESS, { processedAt: new Date() });
        this.logger.log(`Done ${withdrawalId}`);
    }

    @OnQueueFailed()
    onFailed(job: Job, err: Error) {
        this.logger.error(`Failed ${job.id}`, err.message);
    }
}