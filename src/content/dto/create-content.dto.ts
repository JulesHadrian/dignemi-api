import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, IsArray, IsJSON } from 'class-validator';
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

  @ApiProperty({ example: 'ansiedad' })
  @IsString()
  @IsOptional()
  topic?: string;

  @ApiProperty({ example: { steps: [], intro: "..." } })
  @IsNotEmpty()
  body: any; // Validado como objeto JSON al llegar

  @ApiProperty({ example: ['https://pubmed.ncbi.nlm.nih.gov/...'] })
  @IsArray()
  @IsOptional()
  sources?: string[];
}