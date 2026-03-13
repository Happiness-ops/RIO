import { Module } from '@nestjs/common';
import { CheckinsController } from './checkins.controller';
import { CheckinsService } from './checkins.service';
import { StreakService } from './streak.service';

@Module({
  controllers: [CheckinsController],
  providers:   [CheckinsService, StreakService],
  exports:     [StreakService],
})
export class CheckinsModule {}