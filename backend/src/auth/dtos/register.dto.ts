import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'First name must contain at least 2 characters.',
  })
  @MaxLength(50)
  @Transform(({ value }: { value: string }) => String(value.trim()))
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2, {
    message: 'Last name must contain at least 2 characters.',
  })
  @MaxLength(50)
  @Transform(({ value }: { value: string }) => String(value.trim()))
  lastName!: string;

  @IsEmail()
  @MaxLength(255)
  @Transform(({ value }: { value: string }) => String(value.trim()))
  @IsEmail(
    {},
    {
      message: 'Invalid email address.',
    },
  )
  email!: string;

  @IsString()
  @MinLength(8, {
    message: 'Password must contain at least 8 characters.',
  })
  @MaxLength(100)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
    message:
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.',
  })
  @Transform(({ value }: { value: string }) => String(value.trim()))
  password!: string;

  @IsUUID()
  departmentId!: string;
}
