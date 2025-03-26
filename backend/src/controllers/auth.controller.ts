import 'dotenv/config';
import {
  attemptLogin,
  createNewUser,
  existsByEmail,
  getAuthCookieOptions,
  getLogoutCookieOptions, isValidEmail
} from "../utils/auth.util.ts";
import type {AuthRequest, User} from "../../../types/auth.types.ts";
import {createAuthToken} from "../utils/jwt.util.ts";

export const signup = async (req: any, res: any) => {
  const signupRequest: AuthRequest = req.body;

  // Check for email and password
  if (!signupRequest.email || !signupRequest.password) {
    return res.status(400).json({message: "Email and password required."});
  }

  // Check valid email
  if (!isValidEmail(signupRequest.email)) {
    return res.status(400).json({ message: "Please enter a valid email." });
  }

  // Check if email already taken
  if (await existsByEmail(signupRequest.email)) {
    return res.status(400).json({message: "Email already exists."});
  }

  // Check pass length
  if (signupRequest.password.length < 6) {
    return res.status(400).json({message: "Password must be at least 6 characters long."});
  }

  // Create new user
  const newUser: User = await createNewUser(signupRequest);
  newUser.password = undefined; // Remove password from DTO

  // Add auth Cookie
  res.cookie(process.env.AUTH_COOKIE_NAME, createAuthToken(newUser.id), getAuthCookieOptions());

  return res.status(201).json({message: "Signup successful!", user: newUser});
}

export const login = async (req: any, res: any) => {
  const loginRequest: AuthRequest = req.body;

  // Check for email and password
  if (!loginRequest.email || !loginRequest.password) {
    return res.status(400).json({message: "Email and password required."});
  }

  const user = await attemptLogin(loginRequest);

  // Check if valid
  if (!user) {
    return res.status(403).json({message: "Invalid username or password."});
  }

  // Add auth Cookie
  res.cookie(process.env.AUTH_COOKIE_NAME, createAuthToken(user.id), getAuthCookieOptions());

  // Remove password from DTO
  user.password = undefined;
  return res.status(200).json({message: "Login successful!", user});
}

export const logout = async (req: any, res: any) => {
  // Remove Auth Cookie
  res.clearCookie(process.env.AUTH_COOKIE_NAME, getLogoutCookieOptions());

  return res.status(200).json({ message: "Logout successful!"});
}

export const getMe = async (req: any, res: any) => {
  const user: User = req.body.user;

  // Remove password from DTO
  user.password = undefined;
  return res.status(200).json({ message: "User retrieved successfully.", user });
}