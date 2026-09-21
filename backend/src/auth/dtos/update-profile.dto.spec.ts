import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateProfileDto } from './update-profile.dto';

describe('UpdateProfileDto', () => {
  it('trims names and accepts a valid update', async () => {
    const dto = plainToInstance(UpdateProfileDto, { firstName: ' Alice ', lastName: ' Martin ' });
    expect(await validate(dto)).toEqual([]);
    expect(dto).toEqual({ firstName: 'Alice', lastName: 'Martin' });
  });
  it.each([{}, { firstName: ' ', lastName: 'Martin' }, { firstName: 'a'.repeat(51), lastName: 'Martin' }, { firstName: null, lastName: 42 }])('rejects invalid names: %p', async (input) => {
    expect((await validate(plainToInstance(UpdateProfileDto, input))).length).toBeGreaterThan(0);
  });
  it('rejects attempts to change role or another user ID', async () => {
    const dto = plainToInstance(UpdateProfileDto, { firstName: 'Alice', lastName: 'Martin', role: 'ADMIN', id: 'other-user' });
    expect((await validate(dto, { whitelist: true, forbidNonWhitelisted: true })).map((e) => e.property)).toEqual(expect.arrayContaining(['role', 'id']));
  });
});
