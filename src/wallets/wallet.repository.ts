import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Types } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallets.schema';

@Injectable()
export class WalletRepository {
    constructor(@InjectModel(Wallet.name) private readonly walletModel: Model<WalletDocument>) {}

    async createWallet(userId: Types.ObjectId, session?: ClientSession): Promise<WalletDocument> {
        const wallet = new this.walletModel({ userId, balance: Types.Decimal128.fromString('0'), version: 0 });
        return wallet.save(session ? { session } : undefined);
    }

    async findByUserId(userId: Types.ObjectId, session?: ClientSession): Promise<WalletDocument | null> {
        const query = this.walletModel.findOne({ userId });
        if (session) query.session(session);
        return query.exec();
    }

    async updateBalanceByWalletId(walletId: Types.ObjectId, amount: number, expectedVersion: number, session?: ClientSession): Promise<WalletDocument | null> {
        const filter: any = { _id: walletId, version: expectedVersion };

        if (amount < 0) {
            filter.$expr = { $gte: [{ $toDouble: '$balance' }, Math.abs(amount)] };
        }

        const options: any = { new: true };
        if (session) options.session = session;

        return this.walletModel.findOneAndUpdate(filter, { $inc: { balance: amount, version: 1 } }, options).exec() as unknown as Promise<WalletDocument | null>;
    }

    async deposit(userId: Types.ObjectId, amount: number, session?: ClientSession): Promise<WalletDocument | null> {
        const options: any = { new: true };
        if (session) options.session = session;
        return this.walletModel.findOneAndUpdate({ userId }, { $inc: { balance: amount, version: 1 } }, options).exec() as unknown as Promise<WalletDocument | null>;
    }
}