import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, ReorderTasksDto, TasksQueryDto } from './dto/tasks.dto';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  /** POST /v1/tasks */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@CurrentUser() user: RequestUser, @Body() dto: CreateTaskDto) {
    const task = await this.tasksService.create(user.dbUserId, dto);
    return ok('Task created', task);
  }

  /** GET /v1/tasks */
  @Get()
  async findAll(@CurrentUser() user: RequestUser, @Query() query: TasksQueryDto) {
    const result = await this.tasksService.findAll(user.dbUserId, query);
    return ok('Tasks retrieved', result);
  }

  /** GET /v1/tasks/:taskId */
  @Get(':taskId')
  async findOne(@CurrentUser() user: RequestUser, @Param('taskId') taskId: string) {
    const task = await this.tasksService.findOne(user.dbUserId, taskId);
    return ok('Task retrieved', task);
  }

  /** PATCH /v1/tasks/reorder — must come before :taskId to avoid route conflict */
  @Patch('reorder')
  @Throttle({ default: { ttl: 60_000, limit: 30 } }) // 30 reorders/min — drag-drop heavy
  async reorder(@CurrentUser() user: RequestUser, @Body() dto: ReorderTasksDto) {
    const result = await this.tasksService.reorder(user.dbUserId, dto);
    return ok('Tasks reordered', result);
  }

  /** PATCH /v1/tasks/:taskId */
  @Patch(':taskId')
  async update(
    @CurrentUser() user: RequestUser,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskDto,
  ) {
    const task = await this.tasksService.update(user.dbUserId, taskId, dto);
    return ok('Task updated', task);
  }

  /** DELETE /v1/tasks/:taskId */
  @Delete(':taskId')
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: RequestUser, @Param('taskId') taskId: string) {
    await this.tasksService.remove(user.dbUserId, taskId);
    return ok('Task deleted', null);
  }
}