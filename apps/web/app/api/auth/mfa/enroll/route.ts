import { prisma } from "@attestor/db";
import { requireUser } from "@/lib/auth";
import { encrypt } from "@/lib/crypto";
import { generateSecret, qrDataUrl, otpauthUrl } from "@/lib/mfa";

export const dynamic = "force-dynamic";

// Begin TOTP enrollment: generate + store an (encrypted) secret, return a QR to scan.
// mfaEnabled stays false until /enable verifies a code.
export async function POST() {
  const user = await requireUser();
  if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

  const secret = generateSecret();
  await prisma.user.update({ where: { id: user.id }, data: { mfaSecret: encrypt(secret) } });

  return Response.json({
    qr: await qrDataUrl(user.email, secret),
    otpauth: otpauthUrl(user.email, secret),
    secret, // shown once for manual entry
  });
}
