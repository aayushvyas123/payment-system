import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './schemas/wallets.schema';
import { WalletsService } from './wallets.service';
import { WalletRepository } from './wallet.repository';
import { WalletsController } from './wallets.controller';
import { TransactionLogsModule } from '../transaction-logs/transaction-logs.module';

@Module({
    imports: [MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]), TransactionLogsModule],
    controllers: [WalletsController],
    providers: [WalletsService, WalletRepository],
    exports: [WalletsService, WalletRepository],
})
export class WalletsModule {}
