import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean, IsISO8601, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SyncRecordDto {
  @ApiProperty({ example: 'journal_entry', description: 'Tipo de entidad' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ example: 'uuid-v4-client-side', description: 'ID único generado por la app' })
  @IsString()
  @IsNotEmpty()
  entityId: string;

  @ApiProperty({ description: 'Contenido JSON (puede ser cifrado)', example: { text: "Hoy me sentí bien..." } })
  @IsNotEmpty()
  data: any;

  @ApiProperty({ example: '2023-10-27T10:00:00Z', description: 'Fecha de modificación en el dispositivo' })
  @IsISO8601()
  deviceUpdatedAt: string;

  @ApiProperty({ description: 'Si es true, este item fue borrado', required: false })
  @IsBoolean()
  @IsOptional()
  isDeleted?: boolean;
}

export class PushSyncDto {
  @ApiProperty({ type: [SyncRecordDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncRecordDto)
  changes: SyncRecordDto[];
}

export class PullSyncDto {
  @ApiProperty({ description: 'Timestamp de la última vez que sincronizaste (vacio si es la primera vez)', required: false })
  @IsOptional()
  @IsISO8601()
  lastSyncAt?: string;
}