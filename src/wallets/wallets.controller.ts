import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { Types } from 'mongoose';
import { WalletsService } from './wallets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DepositDto } from './dto/deposit.dto';

@Controller('wallets')
@UseGuards(JwtAuthGuard)
export class WalletsController {
    constructor(private readonly walletsService: WalletsService) {}

    @Post('deposit')
    async deposit(@Req() req: any, @Body() dto: DepositDto) {
        return this.walletsService.deposit(new Types.ObjectId(req.user.userId), dto.amount);
    }

    @Get('balance')
    async getBalance(@Req() req: any) {
        const wallet = await this.walletsService.getWalletByUserId(new Types.ObjectId(req.user.userId));
        return { balance: wallet.balance.toString() };
    }
}
