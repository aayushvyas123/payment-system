import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalRepository } from './withdrawal.repository';
import { WithdrawalProcessor } from './withdrawal.processor';
import { Withdrawal, WithdrawalSchema } from './schemas/withdrawals.schema';
import { WalletsModule } from '../wallets/wallets.module';
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Withdrawal.name, schema: WithdrawalSchema }]),
        BullModule.registerQueue({ name: 'withdrawals' }),
        WalletsModule,
        TransactionLogsModule,
    ],
    controllers: [WithdrawalsController],
    providers: [WithdrawalsService, WithdrawalRepository, WithdrawalProcessor],
    exports: [WithdrawalsService],
})
export class WithdrawalsModule {}
