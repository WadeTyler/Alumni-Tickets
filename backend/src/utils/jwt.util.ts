import jwt from 'jsonwebtoken';
import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET;

interface AuthTokenPayload {
  id: string;
}

export function createAuthToken(user_id: string) {
  return jwt.sign({id: user_id}, jwtSecret,
    {expiresIn: '24h'}
  );
}

export function decodeToken(token: string) {
  try {
    const decoded = jwt.verify(token, jwtSecret) as AuthTokenPayload;
    return decoded.id;
  } catch (err) {
    throw new Error("Invalid token");
  }
}