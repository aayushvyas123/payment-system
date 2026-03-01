import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { WalletsModule } from './wallets/wallets.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { TransactionLogsModule } from './transaction-logs/transaction-logs.module';
import { AuthModule } from './auth/auth.module';
import { QueueModule } from './queue/queue.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ uri: config.get<string>('MONGO_URI') }),
    }),
    QueueModule,
    UsersModule,
    WalletsModule,
    WithdrawalsModule,
    TransactionLogsModule,
    AuthModule,
  ],
})
export class AppModule {}
