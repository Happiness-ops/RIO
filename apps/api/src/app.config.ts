import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Production  = 'production',
  Test        = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsString() @IsNotEmpty()
  DATABASE_URL: string;

  @IsString() @IsNotEmpty()
  REDIS_URL: string;

  @IsString() @IsNotEmpty()
  AUTH_PROVIDER: string;

  @IsString() @IsOptional()
  FIREBASE_PROJECT_ID?: string;

  @IsString() @IsOptional()
  FIREBASE_PRIVATE_KEY?: string;

  @IsString() @IsOptional()
  FIREBASE_CLIENT_EMAIL?: string;

  @IsString() @IsOptional()
  AUTH0_DOMAIN?: string;

  @IsString() @IsOptional()
  AUTH0_AUDIENCE?: string;

  @IsString() @IsNotEmpty()
  GEMINI_API_KEY: string;

  @IsString() @IsNotEmpty()
  VAPID_PUBLIC_KEY: string;

  @IsString() @IsNotEmpty()
  VAPID_PRIVATE_KEY: string;

  @IsString() @IsNotEmpty()
  VAPID_EMAIL: string;

  @IsString() @IsOptional()
  CORS_ORIGINS?: string;

  @IsString() @IsOptional()
  SENTRY_DSN?: string;
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(`Config validation failed:\n${errors.toString()}`);
  }
  return validated;
}