import { Controller, Post, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Types } from 'mongoose';

@Controller('withdrawals')
@UseGuards(JwtAuthGuard)
export class WithdrawalsController {
    constructor(private withdrawalsService: WithdrawalsService) {}

    @Post()
    async create(@Req() req, @Body() dto: CreateWithdrawalDto) {
        const userId = new Types.ObjectId(req.user.userId);
        return this.withdrawalsService.createWithdrawal(userId, dto);
    }

    @Get(':id')
    async getOne(@Req() req, @Param('id') id: string) {
        const userId = new Types.ObjectId(req.user.userId);
        const withdrawalId = new Types.ObjectId(id);
        return this.withdrawalsService.getWithdrawal(withdrawalId, userId);
    }
}
