import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

/**
 * Symmetric encryption for secrets at rest (e.g. TOTP secrets). AES-256-GCM.
 * Key from MASTER_ENCRYPTION_KEY (base64, 32 bytes). In dev without one, a fixed
 * key is derived so the app runs — with a warning. Production MUST set the env.
 * (M1 replaces this with per-org envelope encryption backed by a KMS.)
 */
function key(): Buffer {
  const b64 = process.env.MASTER_ENCRYPTION_KEY;
  if (b64) {
    const k = Buffer.from(b64, "base64");
    if (k.length !== 32) throw new Error("MASTER_ENCRYPTION_KEY must be 32 bytes (base64)");
    return k;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("MASTER_ENCRYPTION_KEY is required in production");
  }
  console.warn("[crypto] MASTER_ENCRYPTION_KEY unset — using an insecure dev key");
  return scryptSync("attestor-dev-insecure-key", "attestor-dev-salt", 32);
}

export function encrypt(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  // iv.tag.ciphertext, all base64
  return `${iv.toString("base64")}.${tag.toString("base64")}.${ct.toString("base64")}`;
}

export function decrypt(blob: string): string {
  const [ivB64, tagB64, ctB64] = blob.split(".");
  if (!ivB64 || !tagB64 || !ctB64) throw new Error("malformed ciphertext");
  const decipher = createDecipheriv("aes-256-gcm", key(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(ctB64, "base64")), decipher.final()]).toString("utf8");
}
