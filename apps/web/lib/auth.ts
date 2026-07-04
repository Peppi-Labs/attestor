import { randomBytes, randomUUID, createHash } from "node:crypto";
import { cookies } from "next/headers";
import { prisma, withOrg, withUser, type User, type Org, type Role } from "@attestor/db";
import { hashPassword, verifyPassword } from "./password";
import { audit } from "./audit";

const COOKIE_SESSION = "attestor_user";
const COOKIE_ORG = "attestor_org";
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 days
const sha256 = (v: string) => createHash("sha256").update(v).digest("hex");

// --- signup / login ---
export async function signup(email: string, name: string, password: string) {
  const lower = email.toLowerCase();
  if (await prisma.user.findUnique({ where: { email: lower } })) {
    const e = new Error("email_taken") as Error & { status?: number };
    e.status = 409;
    throw e;
  }
  const user = await prisma.user.create({
    data: { email: lower, name, passwordHash: hashPassword(password) },
  });
  const orgId = randomUUID();
  await withOrg(orgId, async (tx) => {
    await tx.org.create({ data: { id: orgId, name: `${name}'s workspace` } });
    await tx.membership.create({ data: { orgId, userId: user.id, role: "OWNER" } });
  });
  await audit(orgId, user.id, "user.signup", `user:${user.id}`);
  await audit(orgId, user.id, "org.create", `org:${orgId}`, { via: "signup" });
  return { user, orgId };
}

export async function verifyLogin(email: string, password: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) return null;
  return user;
}

// --- sessions ---
export async function createUserSession(userId: string, mfaPending = false): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  await prisma.session.create({
    data: { userId, tokenHash: sha256(token), mfaPending, expiresAt: new Date(Date.now() + TTL_MS) },
  });
  (await cookies()).set(COOKIE_SESSION, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
}

async function rawSession() {
  const token = (await cookies()).get(COOKIE_SESSION)?.value;
  if (!token) return null;
  const s = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    include: { user: true },
  });
  if (!s || s.expiresAt < new Date()) return null;
  return s;
}

/** The signed-in user plus whether they still owe an MFA challenge. */
export async function getSessionUser(): Promise<{ user: User; mfaPending: boolean } | null> {
  const s = await rawSession();
  return s ? { user: s.user, mfaPending: s.mfaPending } : null;
}

/** Fully-authenticated user (MFA satisfied) or null. */
export async function requireUser(): Promise<User | null> {
  const s = await getSessionUser();
  return s && !s.mfaPending ? s.user : null;
}

export async function completeMfaForCurrentSession(): Promise<void> {
  const token = (await cookies()).get(COOKIE_SESSION)?.value;
  if (token) {
    await prisma.session.updateMany({ where: { tokenHash: sha256(token) }, data: { mfaPending: false } });
  }
}

export async function logout(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(COOKIE_SESSION)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
  jar.delete(COOKIE_SESSION);
}

// --- org context ---
export interface OrgContext {
  org: Org;
  role: Role;
}

export async function listUserOrgs(userId: string) {
  return withUser(userId, (tx) =>
    tx.membership.findMany({ where: { userId }, include: { org: true }, orderBy: { createdAt: "asc" } }),
  );
}

/** Resolve the user's active org from the org cookie, defaulting to their first. */
export async function getCurrentOrg(userId: string): Promise<OrgContext | null> {
  const wanted = (await cookies()).get(COOKIE_ORG)?.value;
  const memberships = await listUserOrgs(userId);
  if (memberships.length === 0) return null;
  const chosen = memberships.find((m) => m.orgId === wanted) ?? memberships[0]!;
  return { org: chosen.org, role: chosen.role };
}

export async function switchOrg(userId: string, orgId: string): Promise<boolean> {
  const memberships = await listUserOrgs(userId);
  if (!memberships.some((m) => m.orgId === orgId)) return false;
  (await cookies()).set(COOKIE_ORG, orgId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: TTL_MS / 1000,
  });
  return true;
}
