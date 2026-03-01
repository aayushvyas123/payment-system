import { Injectable, ConflictException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { WalletsService } from '../wallets/wallets.service';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly walletsService: WalletsService,
    ) {}

    async create(email: string, password: string) {
        const existing = await this.usersRepository.findByEmail(email);
        
        if (existing) {
            throw new ConflictException('Email already exists');
        }

        try {
            const user = await this.usersRepository.create({ email, password });
            
            await this.walletsService.createWalletForUser(user._id as Types.ObjectId);
            
            return user;
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Email already exists');
            }
            throw error;
        }
    }

    async findById(userId: string) {
        return this.usersRepository.findById(userId);
    }

    async findByEmail(email: string) {
        return this.usersRepository.findByEmail(email);
    }

}
