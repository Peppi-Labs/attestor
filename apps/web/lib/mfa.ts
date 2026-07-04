import { authenticator } from "otplib";
import QRCode from "qrcode";

const ISSUER = "Attestor";

// Small tolerance for clock drift.
authenticator.options = { window: 1 };

export function generateSecret(): string {
  return authenticator.generateSecret();
}

export function otpauthUrl(email: string, secret: string): string {
  return authenticator.keyuri(email, ISSUER, secret);
}

export async function qrDataUrl(email: string, secret: string): Promise<string> {
  return QRCode.toDataURL(otpauthUrl(email, secret));
}

export function verifyToken(token: string, secret: string): boolean {
  try {
    return authenticator.verify({ token: token.replace(/\s/g, ""), secret });
  } catch {
    return false;
  }
}
