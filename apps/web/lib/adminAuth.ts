import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { prisma, type AdminUser } from "@attestor/db";

export { hashPassword, verifyPassword } from "./password";

const COOKIE = "attestor_admin";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

// --- sessions (opaque token in cookie; sha256 stored in DB so it's revocable) ---
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

export async function createSession(adminId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  await prisma.adminSession.create({
    data: {
      adminId,
      tokenHash: sha256(token),
      expiresAt: new Date(Date.now() + SESSION_TTL_MS),
    },
  });
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function getSessionAdmin(): Promise<AdminUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.adminSession.findUnique({
    where: { tokenHash: sha256(token) },
    include: { admin: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.admin;
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) {
    await prisma.adminSession.deleteMany({ where: { tokenHash: sha256(token) } });
  }
  jar.delete(COOKIE);
}
