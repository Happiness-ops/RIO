// ── checkins.controller.ts ────────────────────────────────────────────────────
import {
  Controller, Post, Get, Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CheckinsService } from './checkins.service';
import { CreateCheckinDto, CheckinsQueryDto } from './dto/checkins.dto';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('habits/:habitId/checkins')
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  /** POST /v1/habits/:habitId/checkins */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Throttle({ default: { ttl: 60_000, limit: 20 } })
  async create(
    @CurrentUser() user: RequestUser,
    @Param('habitId') habitId: string,
    @Body() dto: CreateCheckinDto,
  ) {
    const checkin = await this.checkinsService.create(user.dbUserId, habitId, dto);
    return ok('Check-in logged', checkin);
  }

  /** GET /v1/habits/:habitId/checkins */
  @Get()
  async findHistory(
    @CurrentUser() user: RequestUser,
    @Param('habitId') habitId: string,
    @Query() query: CheckinsQueryDto,
  ) {
    const result = await this.checkinsService.findHistory(user.dbUserId, habitId, query);
    return ok('Check-in history retrieved', result);
  }
}