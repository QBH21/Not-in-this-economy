import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "not-in-this-economy-dev-secret-change-me";

interface JwtPayload {
  id: number;
  email: string;
}

export function signToken(user: { id: number; email: string }): string {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(request: NextRequest): JwtPayload | null {
  const header = request.headers.get("authorization");
  if (!header || !header.startsWith("Bearer ")) return null;
  const token = header.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
