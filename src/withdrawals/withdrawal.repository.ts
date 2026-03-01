import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Types } from 'mongoose';
import { Withdrawal, WithdrawalDocument } from './schemas/withdrawals.schema';
import { WithdrawalStatus } from './enums/withdrawal-status.enum';

@Injectable()
export class WithdrawalRepository {
  constructor(@InjectModel(Withdrawal.name) private readonly withdrawalModel: Model<WithdrawalDocument>) {}

  async create(data: Partial<Withdrawal>, session?: ClientSession): Promise<WithdrawalDocument> {
    const withdrawal = new this.withdrawalModel(data);
    return withdrawal.save(session ? { session } : undefined);
  }

  async findByIdempotencyKey(key: string, session?: ClientSession): Promise<WithdrawalDocument | null> {
    return this.withdrawalModel.findOne({ idempotencyKey: key }).session(session || null);
  }

  async findById(id: Types.ObjectId, session?: ClientSession): Promise<WithdrawalDocument | null> {
    return this.withdrawalModel.findById(id).session(session || null);
  }

  async updateStatus(withdrawalId: Types.ObjectId, version: number, status: WithdrawalStatus, updates?: Partial<Withdrawal>, session?: ClientSession): Promise<WithdrawalDocument | null> {
    return this.withdrawalModel.findOneAndUpdate({ _id: withdrawalId, version }, { $set: { status, ...updates }, $inc: { version: 1 } }, { new: true, session });
  }
}