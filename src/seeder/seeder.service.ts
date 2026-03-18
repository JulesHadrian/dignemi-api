import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CONTENT_SEEDS } from './content-seeds';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeederService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedContent();
  }

  private async seedContent() {
    for (const seed of CONTENT_SEEDS) {
      const { id, ...data } = seed;
      await this.prisma.contentItem.upsert({
        where: { id },
        update: {},
        create: { id, ...data },
      });
    }
    this.logger.log(
      `Seeds verificados: ${CONTENT_SEEDS.map((s) => s.title).join(', ')}`,
    );
  }
}
