// ── scorecard.controller.ts ───────────────────────────────────────────────────
import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ScorecardService } from './scorecard.service';
import {
  CreateScorecardEntryDto, UpdateScorecardEntryDto, ConvertToHabitDto,
} from './dto/scorecard.dto';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('scorecard')
export class ScorecardController {
  constructor(private readonly scorecardService: ScorecardService) {}

  /** GET /v1/scorecard */
  @Get()
  async getScorecard(@CurrentUser() user: RequestUser) {
    const data = await this.scorecardService.getScorecard(user.dbUserId);
    return ok('Scorecard retrieved', data);
  }

  /** POST /v1/scorecard */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addEntry(@CurrentUser() user: RequestUser, @Body() dto: CreateScorecardEntryDto) {
    const entry = await this.scorecardService.addEntry(user.dbUserId, dto);
    return ok('Behavior added to scorecard', entry);
  }

  /** PATCH /v1/scorecard/:entryId */
  @Patch(':entryId')
  async updateEntry(
    @CurrentUser() user: RequestUser,
    @Param('entryId') entryId: string,
    @Body() dto: UpdateScorecardEntryDto,
  ) {
    const entry = await this.scorecardService.updateEntry(user.dbUserId, entryId, dto);
    return ok('Scorecard entry updated', entry);
  }

  /** DELETE /v1/scorecard/:entryId */
  @Delete(':entryId')
  @HttpCode(HttpStatus.OK)
  async deleteEntry(@CurrentUser() user: RequestUser, @Param('entryId') entryId: string) {
    await this.scorecardService.deleteEntry(user.dbUserId, entryId);
    return ok('Scorecard entry deleted', null);
  }

  /** POST /v1/scorecard/:entryId/convert */
  @Post(':entryId/convert')
  @HttpCode(HttpStatus.CREATED)
  async convertToHabit(
    @CurrentUser() user: RequestUser,
    @Param('entryId') entryId: string,
    @Body() dto: ConvertToHabitDto,
  ) {
    const result = await this.scorecardService.convertToHabit(user.dbUserId, entryId, dto);
    return ok('Behavior converted to tracked habit', result);
  }
}