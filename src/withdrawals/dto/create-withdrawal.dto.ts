import { IsNotEmpty, IsNumber, IsString, IsPositive, Min, MaxLength, IsOptional, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateWithdrawalDto {
    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @Min(0.01)
    @Transform(({ value }) => Number(parseFloat(value).toFixed(2)))
    amount: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    destination: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(64)
    idempotencyKey: string;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}
