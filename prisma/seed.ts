import { PrismaClient } from '@prisma/client';
import { CONTENT_SEEDS } from '../src/seeder/content-seeds';

const prisma = new PrismaClient();

async function main() {
  for (const seed of CONTENT_SEEDS) {
    const { id, ...data } = seed;
    const item = await prisma.contentItem.upsert({
      where: { id },
      update: {},
      create: { id, ...data },
    });
    console.log('Seed creado:', item.title);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
