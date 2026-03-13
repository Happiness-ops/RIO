// ── habits.controller.ts ─────────────────────────────────────────────────────
import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { HabitsService } from './habits.service';
import { CreateHabitDto, UpdateHabitDto, HabitsQueryDto } from './dto/habits.dto';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('habits')
export class HabitsController {
  constructor(private readonly habitsService: HabitsService) {}

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateHabitDto) {
    const habit = await this.habitsService.create(user.dbUserId, dto);
    return ok('Habit created', habit);
  }

  @Get()
  async findAll(@CurrentUser() user: RequestUser, @Query() query: HabitsQueryDto) {
    const result = await this.habitsService.findAll(user.dbUserId, query);
    return ok('Habits retrieved', result);
  }

  @Get(':habitId')
  async findOne(@CurrentUser() user: RequestUser, @Param('habitId') habitId: string) {
    const habit = await this.habitsService.findOne(user.dbUserId, habitId);
    return ok('Habit retrieved', habit);
  }

  @Patch(':habitId')
  async update(
    @CurrentUser() user: RequestUser,
    @Param('habitId') habitId: string,
    @Body() dto: UpdateHabitDto,
  ) {
    const habit = await this.habitsService.update(user.dbUserId, habitId, dto);
    return ok('Habit updated', habit);
  }

  @Delete(':habitId')
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: RequestUser, @Param('habitId') habitId: string) {
    await this.habitsService.remove(user.dbUserId, habitId);
    return ok('Habit deleted', null);
  }
}