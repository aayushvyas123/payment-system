import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Wallet {
    @Prop({ type: Types.ObjectId, required: true, ref: 'User', unique: true, index: true })
    userId: Types.ObjectId;

    @Prop({ type: Types.Decimal128, required: true, default: Types.Decimal128.fromString('0') })
    balance: Types.Decimal128;

    @Prop({ type: Number, required: true, default: 0 })
    version: number;
}

export type WalletDocument = HydratedDocument<Wallet>;
export const WalletSchema = SchemaFactory.createForClass(Wallet);
WalletSchema.index({ userId: 1 }, { unique: true });
