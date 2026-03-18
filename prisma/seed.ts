/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Seed CLI — ejecutado con `npx prisma db seed`.
 * Importa dinámicamente los datos para no contaminar el build de NestJS.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Importación dinámica para evitar que tsconfig.build incluya prisma/ en dist/
  const { CONTENT_SEEDS } = require('../src/seeder/content-seeds');

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
