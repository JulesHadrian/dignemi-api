import { Module } from '@nestjs/common';
import { FlagsService } from './flags.service';
import { FlagsController } from './flags.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [FlagsController],
  providers: [FlagsService],
  exports: [FlagsService], // Exportamos por si otros módulos necesitan consultar flags internamente
})
export class FlagsModule {}