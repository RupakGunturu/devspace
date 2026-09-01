import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { User, IUser, UserRole } from "../models/User";

export interface AuthRequest extends Request {
  user?: IUser;
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

interface JwtPayload {
  userId: string;
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    User.findById(decoded.userId).then((user) => {
      if (!user) {
        res.status(401).json({ error: "User not found" });
        return;
      }
      req.user = user;
      next();
    });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

export function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    next();
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    User.findById(decoded.userId).then((user) => {
      if (user) req.user = user;
      next();
    });
  } catch {
    next();
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: "Admin access required" });
      return;
    }
    next();
  };
}
