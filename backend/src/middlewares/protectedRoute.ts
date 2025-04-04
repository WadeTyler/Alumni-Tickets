import 'dotenv/config';
import {decodeToken} from "../utils/jwt.util.js";
import {findUserById} from "../utils/auth.util.js";

const protectedRoute = async (req: any, res: any, next: any) => {
  try {
    const authToken = req.cookies[process.env.AUTH_COOKIE_NAME as string];
    // No auth token found
    if (!authToken) {
      throw new Error("No auth token provided.");
    }

    // Validate token
    const userId = decodeToken(authToken);

    const user = await findUserById(userId);
    if (!user) {
      throw new Error("Invalid userID");
    }

    // Attach user to request body.
    req.body.user = user;
    next();
  } catch (e) {
    return res.status(401).json({message: "You are not authorized to perform that action."});
  }
}

export default protectedRoute;