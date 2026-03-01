import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { TransactionType } from '../enums/transaction-type.enum';

@Schema({ timestamps: true })
export class TransactionLog {
    @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Wallet', index: true })
    walletId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Withdrawal', index: true })
    withdrawalId?: Types.ObjectId;

    @Prop({ type: String, enum: TransactionType, required: true, index: true })
    type: TransactionType;

    @Prop({ type: Types.Decimal128, required: true })
    amount: Types.Decimal128;

    @Prop({ type: String, required: true, index: true })
    status: string;

    @Prop({ type: String, required: true, unique: true, index: true })
    referenceId: string;

    @Prop({ type: Types.Decimal128, required: true })
    beforeBalance: Types.Decimal128;

    @Prop({ type: Types.Decimal128, required: true })
    afterBalance: Types.Decimal128;

    @Prop({ type: String })
    description?: string;

    @Prop({ type: Object })
    metadata?: Record<string, any>;
}

export type TransactionLogDocument = HydratedDocument<TransactionLog>;
export const TransactionLogSchema = SchemaFactory.createForClass(TransactionLog);

TransactionLogSchema.index({ walletId: 1, createdAt: -1 });
TransactionLogSchema.index({ userId: 1, type: 1, createdAt: -1 });
TransactionLogSchema.index({ withdrawalId: 1 }, { sparse: true });
