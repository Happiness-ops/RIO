export {};
// ── notifications.dto.ts ──────────────────────────────────────────────────────
import { IsString, IsNotEmpty, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

class PushKeysDto {
  @IsString() @IsNotEmpty()
  p256dh: string;

  @IsString() @IsNotEmpty()
  auth: string;
}

class PushSubscriptionDto {
  @IsString() @IsNotEmpty()
  endpoint: string;

  @IsObject()
  @ValidateNested()
  @Type(() => PushKeysDto)
  keys: PushKeysDto;
}

export class SubscribePushDto {
  @IsObject()
  @ValidateNested()
  @Type(() => PushSubscriptionDto)
  subscription: PushSubscriptionDto;
}