import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';
import { TransactionLog, TransactionLogDocument } from './schemas/transaction-logs.schema';

@Injectable()
export class TransactionLogsRepository {
    constructor(@InjectModel(TransactionLog.name) private readonly transactionLogModel: Model<TransactionLogDocument>) {}

    async create(data: Partial<TransactionLog>, session?: ClientSession) {
        const transaction = new this.transactionLogModel(data);
        return transaction.save(session ? { session } : undefined);
    }
}