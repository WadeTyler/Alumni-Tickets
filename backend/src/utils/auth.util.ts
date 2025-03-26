import db from '../config/db.config.ts';
import type {AuthRequest, User} from "../../../types/auth.types.ts";
import {encodePassword, isPasswordMatch} from "./password.util.ts";
import type {CookieOptions} from "express";

export async function findUserById(id: string) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

export async function existsByEmail(email: string) {
  const result = await db.query("SELECT * FROM users WHERE LOWER(users.email)=LOWER($1)", [email]);
  const user = result.rows[0];

  return !!user;
}

// Returns undefined if invalid
export async function attemptLogin(loginRequest: AuthRequest) {
  // Search for user by email
  const result = await db.query("SELECT * FROM users WHERE LOWER(users.email)=LOWER($1)", [loginRequest.email]);
  const user: User = result.rows[0];

  // Check if found by email
  if (!user) return undefined;

  // Check passwords match
  if (!await isPasswordMatch(loginRequest.password, user.password)) {
    return undefined;
  }

  // Valid
  return user;
}

export async function createNewUser(signupRequest: AuthRequest) {
  // Encode password
  const encodedPassword = await encodePassword(signupRequest.password);
  const result = await db.query("INSERT INTO users(email, password) VALUES ($1, $2) RETURNING *", [signupRequest.email, encodedPassword]);
  return result.rows[0];
}

export function getAuthCookieOptions(): CookieOptions {
  return {
    maxAge: 86400000,
    path: "/",
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "PRODUCTION"
  }
}

export function getLogoutCookieOptions(): CookieOptions {
  return {
    path: "/",
    httpOnly: true,
    secure: process.env.ENVIRONMENT === "PRODUCTION"
  }
}