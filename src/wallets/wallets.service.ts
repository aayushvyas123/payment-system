import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { WalletDocument } from './schemas/wallets.schema';
import { Types, Connection } from 'mongoose';
import { WalletRepository } from './wallet.repository';
import { TransactionLogsRepository } from '../transaction-logs/transaction.repository';
import { TransactionType } from '../transaction-logs/enums/transaction-type.enum';

@Injectable()
export class WalletsService {
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly transactionLogsRepository: TransactionLogsRepository,
        @InjectConnection() private readonly connection: Connection,
    ) {}

    async createWalletForUser(userId: Types.ObjectId): Promise<WalletDocument> {
        return this.walletRepository.createWallet(userId);
    }

    async getWalletByUserId(userId: Types.ObjectId): Promise<WalletDocument> {
        const wallet = await this.walletRepository.findByUserId(userId);
        if (!wallet) throw new NotFoundException('Wallet not found');
        return wallet;
    }

    async deposit(userId: Types.ObjectId, amount: number): Promise<WalletDocument> {
        if (amount <= 0) throw new BadRequestException('Amount must be greater than 0');

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            const walletBefore = await this.walletRepository.findByUserId(userId, session);
            if (!walletBefore) throw new NotFoundException('Wallet not found');

            const wallet = await this.walletRepository.deposit(userId, amount, session);
            if (!wallet) throw new BadRequestException('Deposit failed');

            await this.transactionLogsRepository.create({
                userId, walletId: wallet._id as Types.ObjectId, type: TransactionType.DEPOSIT,
                amount: Types.Decimal128.fromString(amount.toFixed(2)), status: 'SUCCESS',
                referenceId: `DEP-${new Types.ObjectId().toHexString()}-${Date.now()}`,
                beforeBalance: walletBefore.balance, afterBalance: wallet.balance,
            }, session);

            await session.commitTransaction();
            return wallet;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}
