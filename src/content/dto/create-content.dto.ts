import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  IsArray,
  IsJSON,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContentDto {
  @ApiProperty({ example: 'route', description: 'route, exercise, article' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: 'Ruta de Calma Total' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Una descripción breve del contenido',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'ansiedad' })
  @IsString()
  @IsOptional()
  topic?: string;

  @ApiProperty({ example: 'es-LATAM', default: 'es-LATAM', required: false })
  @IsString()
  @IsOptional()
  locale?: string;

  @ApiProperty({ example: { steps: [], intro: '...' } })
  @IsNotEmpty()
  body: any; // Validado como objeto JSON al llegar

  @ApiProperty({ example: ['https://pubmed.ncbi.nlm.nih.gov/...'] })
  @IsArray()
  @IsOptional()
  sources?: string[];

  @ApiProperty({ example: 'disclaimer-001', required: false })
  @IsString()
  @IsOptional()
  disclaimerId?: string;

  @ApiProperty({ example: 1, default: 1, required: false })
  @IsInt()
  @IsOptional()
  version?: number;

  @ApiProperty({
    example: true,
    default: true,
    required: false,
    description: 'Si es true, requiere suscripción activa',
  })
  @IsBoolean()
  @IsOptional()
  isPremium?: boolean;

  @ApiProperty({ example: true, default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
