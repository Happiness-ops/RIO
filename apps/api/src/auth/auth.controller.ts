import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SyncUserDto } from './dto/auth.dto';
import { Public } from '@/common/decorators/public.decorator';
import { ok } from '@/common/types/response.helper';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /v1/auth/sync
   * Called immediately after every login from the client.
   * Verifies the JWT and creates/updates the user in the database.
   * Rate limited to 10 requests per minute (strict — auth endpoint).
   */
  @Public()
  @Post('sync')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  async sync(@Body() dto: SyncUserDto) {
    const user = await this.authService.syncUser(dto.token);
    return ok('User synced successfully', user);
  }
}