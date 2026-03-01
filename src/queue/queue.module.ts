import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: { host: config.get('REDIS_HOST', 'localhost'), port: config.get('REDIS_PORT', 6379) },
        defaultJobOptions: { removeOnComplete: 100, removeOnFail: 500, attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
      }),
    }),
  ],
  exports: [BullModule],
})
export class QueueModule {}
