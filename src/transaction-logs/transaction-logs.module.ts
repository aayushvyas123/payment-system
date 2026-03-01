import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionLog, TransactionLogSchema } from './schemas/transaction-logs.schema';
import { TransactionLogsRepository } from './transaction.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: TransactionLog.name, schema: TransactionLogSchema }])],
  providers: [TransactionLogsRepository],
  exports: [TransactionLogsRepository]
})
export class TransactionLogsModule {}
