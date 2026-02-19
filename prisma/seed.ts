import { prisma } from "../src/lib/db";
import { seedDemoData } from "../src/lib/demo/seed-demo";

async function main() {
  await seedDemoData(prisma);
  // eslint-disable-next-line no-console
  console.log("Seed completed.");
}

main()
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
