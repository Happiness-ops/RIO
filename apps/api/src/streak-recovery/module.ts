import { Module } from '@nestjs/common';
import { StreakRecoveryController } from './controller';
import { StreakRecoveryService } from './service';
import { SharedModule } from '@/shared/shared.module';

@Module({
  imports: [SharedModule],
  controllers: [StreakRecoveryController],
  providers: [StreakRecoveryService],
})
export class StreakRecoveryModule {}