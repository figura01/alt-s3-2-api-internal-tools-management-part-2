import { IsEnum, ValidateIf } from 'class-validator';
import { UserRole, UserStatus } from '@prisma/client';

export class UpdateUserDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(UserRole)
  role?: UserRole;

  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(UserStatus)
  status?: UserStatus;
}
