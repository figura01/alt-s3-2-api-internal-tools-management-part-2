import { PickType } from '@nestjs/swagger';
import { RegisterDto } from './register.dto';

export class UpdateProfileDto extends PickType(RegisterDto, [
  'firstName',
  'lastName',
] as const) {}
