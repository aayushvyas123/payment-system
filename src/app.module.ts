import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { TransactionLogsModule } from './transaction-logs/transaction-logs.module';

@Module({
  imports: [UsersModule, WalletsModule, WithdrawalsModule, TransactionLogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
