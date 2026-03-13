import { IsString, IsNotEmpty } from 'class-validator';

export class SyncUserDto {
  // The raw JWT token from the client — validated server-side by Firebase/Auth0 Admin
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class AuthResponseDto {
  id: string;
  email: string;
  authProvider: string;
  timezone: string;
  isVerified: boolean;
  onboardingCompleted: boolean;
  createdAt: Date;
}