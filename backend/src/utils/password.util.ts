import bcrypt from 'bcrypt';

export async function encodePassword(password: string) {
  const saltRounds = 10;

  return await bcrypt.hash(password, saltRounds);
}

export function isPasswordMatch(plainPassword: string, encodedPassword: string) {
  return bcrypt.compare(plainPassword, encodedPassword);
}