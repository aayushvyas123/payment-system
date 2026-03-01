import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { WithdrawalStatus } from '../enums/withdrawal-status.enum';

@Schema({ timestamps: true })
export class Withdrawal {
    @Prop({ type: Types.ObjectId, required: true, ref: 'User', index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, required: true, ref: 'Wallet', index: true })
    walletId: Types.ObjectId;

    @Prop({ type: Types.Decimal128, required: true })
    amount: Types.Decimal128;

    @Prop({ type: String, required: true })
    destination: string;

    @Prop({ type: String, enum: WithdrawalStatus, required: true, default: WithdrawalStatus.PENDING, index: true })
    status: WithdrawalStatus;

    @Prop({ type: String, required: true, unique: true, index: true })
    idempotencyKey: string;

    @Prop({ type: Number, required: true, default: 0 })
    version: number;

    @Prop({ type: Types.Decimal128, required: true })
    beforeBalance: Types.Decimal128;

    @Prop({ type: Types.Decimal128 })
    afterBalance?: Types.Decimal128;

    @Prop({ type: String })
    failureReason?: string;

    @Prop({ type: Date })
    processedAt?: Date;

    @Prop({ type: Object })
    metadata?: Record<string, any>;
}

export type WithdrawalDocument = HydratedDocument<Withdrawal>;
export const WithdrawalSchema = SchemaFactory.createForClass(Withdrawal);

WithdrawalSchema.index({ userId: 1, status: 1, createdAt: -1 });
WithdrawalSchema.index({ walletId: 1, status: 1 });
WithdrawalSchema.index({ status: 1, createdAt: 1 });