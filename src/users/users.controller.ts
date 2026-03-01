import {Controller, Post, Body, Get, UseGuards, Req} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController{
    constructor(private userService: UsersService){}

    @Post('register')
    async register(@Body() dto: CreateUserDto){
        return this.userService.create(dto.email, dto.password);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Req() req){
        return this.userService.findById(req.user.userId);
    }
}
