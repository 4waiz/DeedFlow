import { prisma } from "../src/lib/db";
import { seedDemoData } from "../src/lib/demo/seed-demo";

async function main() {
  if (process.env.DEMO_MODE !== "true") {
    // eslint-disable-next-line no-console
    console.log("DEMO_MODE is false. Seed skipped.");
    return;
  }

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
