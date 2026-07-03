import { prisma } from "@attestor/db";
import { hashPassword } from "../lib/password.js";

/**
 * Bootstrap / manage platform admin users.
 *   npm run create-admin -w @attestor/web -- <email> <name> <password>
 * Idempotent: re-running for an existing email resets that admin's password.
 */
async function main() {
  const [email, name, password] = process.argv.slice(2);
  if (!email || !name || !password) {
    console.error("Usage: create-admin <email> <name> <password>");
    process.exit(1);
  }
  if (password.length < 10) {
    console.error("Password must be at least 10 characters.");
    process.exit(1);
  }
  const admin = await prisma.adminUser.upsert({
    where: { email: email.toLowerCase() },
    update: { name, passwordHash: hashPassword(password) },
    create: { email: email.toLowerCase(), name, passwordHash: hashPassword(password) },
  });
  console.log(`✓ Admin ready: ${admin.email} (${admin.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
