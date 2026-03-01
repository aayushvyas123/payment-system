import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<UserDocument>,
    ) {}

    async create(userData: Partial<User>): Promise<UserDocument> {
        const user = new this.userModel(userData);
        return user.save();
    }

    async findById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findById(userId).exec();
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return this.userModel.findOne({ email }).exec();
    }

    async updateById(userId: string, updateData: Partial<User>): Promise<UserDocument | null> {
        return this.userModel.findByIdAndUpdate(userId, updateData, { new: true }).exec();
    }

    async deleteById(userId: string): Promise<UserDocument | null> {
        return this.userModel.findByIdAndDelete(userId).exec();
    }
}
