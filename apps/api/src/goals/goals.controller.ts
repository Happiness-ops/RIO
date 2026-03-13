import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { GoalsService } from './goals.service';
import { CreateGoalDto, UpdateGoalDto, GoalsQueryDto } from './dto/goals.dto';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok, paginated } from '@/common/types/response.helper';

@Controller('goals')
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  /** POST /v1/goals */
  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateGoalDto) {
    const goal = await this.goalsService.create(user.dbUserId, dto);
    return ok('Goal created', goal);
  }

  /** GET /v1/goals */
  @Get()
  async findAll(@CurrentUser() user: RequestUser, @Query() query: GoalsQueryDto) {
    const result = await this.goalsService.findAll(user.dbUserId, query);
    return ok('Goals retrieved', result);
  }

  /** GET /v1/goals/:goalId */
  @Get(':goalId')
  async findOne(@CurrentUser() user: RequestUser, @Param('goalId') goalId: string) {
    const goal = await this.goalsService.findOne(user.dbUserId, goalId);
    return ok('Goal retrieved', goal);
  }

  /** PATCH /v1/goals/:goalId */
  @Patch(':goalId')
  async update(
    @CurrentUser() user: RequestUser,
    @Param('goalId') goalId: string,
    @Body() dto: UpdateGoalDto,
  ) {
    const goal = await this.goalsService.update(user.dbUserId, goalId, dto);
    return ok('Goal updated', goal);
  }

  /** DELETE /v1/goals/:goalId */
  @Delete(':goalId')
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: RequestUser, @Param('goalId') goalId: string) {
    await this.goalsService.remove(user.dbUserId, goalId);
    return ok('Goal deleted', null);
  }
}