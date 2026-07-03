import { prisma } from "../src/index.js";

/**
 * Seed placeholder. Global (non-tenant) reference data is seeded here — e.g. the
 * initial published CASA SpecVersion (added in M2). Tenant data is never seeded globally.
 */
async function main() {
  const orgCount = await prisma.org.count();
  console.log(`Seed complete. Orgs in DB: ${orgCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
