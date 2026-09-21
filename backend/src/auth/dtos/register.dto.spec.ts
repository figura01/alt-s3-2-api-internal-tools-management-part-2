import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterDto } from './register.dto';

describe('RegisterDto', () => {
  const valid = { firstName: 'Test', lastName: 'Account', email: 'test@example.com', password: ' Example123! ', departmentId: 'cmdepartment1' };

  it('accepts CUID department IDs and preserves the password', async () => {
    const dto = plainToInstance(RegisterDto, valid);
    expect(await validate(dto)).toEqual([]);
    expect(dto.password).toBe(valid.password);
  });

  it('rejects missing fields without throwing during transformation', async () => {
    const dto = plainToInstance(RegisterDto, { firstName: null, lastName: 42, email: null });
    expect((await validate(dto)).length).toBeGreaterThan(0);
  });

  it('rejects weak passwords', async () => {
    const dto = plainToInstance(RegisterDto, { ...valid, password: 'password' });
    expect((await validate(dto)).some((error) => error.property === 'password')).toBe(true);
  });
});
