import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { Connection, Types } from 'mongoose';
import { WithdrawalRepository } from './withdrawal.repository';
import { WalletRepository } from '../wallets/wallet.repository';
import { TransactionLogsRepository } from '../transaction-logs/transaction.repository';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WithdrawalStatus } from './enums/withdrawal-status.enum';
import { TransactionType } from '../transaction-logs/enums/transaction-type.enum';
import { WithdrawalDocument } from './schemas/withdrawals.schema';
import { WithdrawalJobData } from './withdrawal.processor';

@Injectable()
export class WithdrawalsService {
    constructor(
        private readonly withdrawalRepository: WithdrawalRepository,
        private readonly walletRepository: WalletRepository,
        private readonly transactionLogsRepository: TransactionLogsRepository,
        @InjectConnection() private readonly connection: Connection,
        @InjectQueue('withdrawals') private readonly withdrawalQueue: Queue<WithdrawalJobData>,
    ) {}

    async createWithdrawal(userId: Types.ObjectId, dto: CreateWithdrawalDto): Promise<WithdrawalDocument> {
        const { amount, destination, idempotencyKey, metadata } = dto;

        const existing = await this.withdrawalRepository.findByIdempotencyKey(idempotencyKey);
        if (existing) {
            if (!existing.userId.equals(userId)) throw new ConflictException('Idempotency key already used');
            return existing;
        }

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            const wallet = await this.walletRepository.findByUserId(userId, session);
            if (!wallet) throw new NotFoundException('Wallet not found');

            const currentBalance = parseFloat(wallet.balance.toString());
            if (currentBalance < amount) throw new BadRequestException('Insufficient balance');

            const amountDecimal = Types.Decimal128.fromString(amount.toFixed(2));
            const beforeBalance = wallet.balance;

            const updatedWallet = await this.walletRepository.updateBalanceByWalletId(wallet._id as Types.ObjectId, -amount, wallet.version, session);
            if (!updatedWallet) throw new ConflictException('Balance update failed');

            const withdrawal = await this.withdrawalRepository.create({
                userId, walletId: wallet._id as Types.ObjectId, amount: amountDecimal, destination,
                status: WithdrawalStatus.PENDING, idempotencyKey, beforeBalance,
                afterBalance: updatedWallet.balance, metadata, version: 0,
            }, session);

            await this.transactionLogsRepository.create({
                userId, walletId: wallet._id as Types.ObjectId, withdrawalId: withdrawal._id as Types.ObjectId,
                type: TransactionType.WITHDRAW, amount: amountDecimal, status: 'PENDING',
                referenceId: `WD-${withdrawal._id}-${Date.now()}`, beforeBalance, afterBalance: updatedWallet.balance,
            }, session);

            await session.commitTransaction();

            await this.withdrawalQueue.add('process-withdrawal', {
                withdrawalId: (withdrawal._id as Types.ObjectId).toString(),
            }, { jobId: idempotencyKey });

            return withdrawal;
        } catch (error) {
            await session.abortTransaction();
            if (error.code === 11000) {
                const existing = await this.withdrawalRepository.findByIdempotencyKey(idempotencyKey);
                if (existing?.userId.equals(userId)) return existing;
                throw new ConflictException('Idempotency key already used');
            }
            throw error;
        } finally {
            session.endSession();
        }
    }

    async getWithdrawal(withdrawalId: Types.ObjectId, userId: Types.ObjectId): Promise<WithdrawalDocument> {
        const withdrawal = await this.withdrawalRepository.findById(withdrawalId);
        if (!withdrawal || !withdrawal.userId.equals(userId)) throw new NotFoundException('Withdrawal not found');
        return withdrawal;
    }
}

