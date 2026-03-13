import { Controller, Get } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { DashboardService } from './dashboard.service';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  /** GET /v1/dashboard */
  @Get()
  @Throttle({ default: { ttl: 60_000, limit: 60 } })
  async getDashboard(@CurrentUser() user: RequestUser) {
    const dashboard = await this.dashboardService.getDashboard(user.dbUserId);
    return ok('Dashboard retrieved', dashboard);
  }
}