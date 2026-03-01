import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { UserStatus } from '../enums/user-status.enum';
import * as bcrypt from 'bcrypt';

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;
    
    @Prop({ required: true, enum: UserStatus, default: UserStatus.ACTIVE })
    status: UserStatus;

    @Prop({ required: true })
    password: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.pre('save', async function() {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});