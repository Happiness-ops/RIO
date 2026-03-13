import { Controller, Get, Patch, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/users.dto';
import { CurrentUser, RequestUser } from '@/common/decorators/current-user.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /** GET /v1/users/me */
  @Get('me')
  async getProfile(@CurrentUser() user: RequestUser) {
    const profile = await this.usersService.getProfile(user.dbUserId);
    return ok('Profile retrieved', profile);
  }

  /** PATCH /v1/users/me/profile */
  @Patch('me/profile')
  async updateProfile(
    @CurrentUser() user: RequestUser,
    @Body() dto: UpdateProfileDto,
  ) {
    const profile = await this.usersService.updateProfile(user.dbUserId, dto);
    return ok('Profile updated', profile);
  }
    /** GET /v1/users/me/behavioral-snapshot  (Epic 8) */
  @Get('me/behavioral-snapshot')
  async getBehavioralSnapshot(@CurrentUser() user: RequestUser) {
    const snapshot = await this.usersService.getBehavioralSnapshot(user.dbUserId);
    return ok('Behavioral snapshot retrieved', snapshot);
  }

  /** DELETE /v1/users/me */
  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 3_600_000, limit: 3 } }) // 3 per hour — strict
  async deleteAccount(@CurrentUser() user: RequestUser) {
    await this.usersService.deleteAccount(user.dbUserId);
    return ok('Account scheduled for deletion', null);
  }
}