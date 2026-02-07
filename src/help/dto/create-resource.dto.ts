import { IsString, IsNotEmpty, IsOptional, IsBoolean, Matches } from 'class-validator'; // <-- CAMBIO AQUÍ (Matches)
import { ApiProperty } from '@nestjs/swagger';

export class CreateHelpResourceDto {
  @ApiProperty({ example: 'MX', description: 'Código de país ISO de 2 letras o "GLOBAL"' })
  @IsString()
  @Matches(/^([A-Z]{2}|GLOBAL)$/, {
    message: 'country must be a 2-letter ISO code (e.g., MX) or "GLOBAL"',
  })
  country: string;

  @ApiProperty({ example: 'Cruz Roja' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Atención de emergencias médicas', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '911', required: false })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({ default: false, description: 'Si es true, la app lo muestra destacado/rojo' })
  @IsBoolean()
  @IsOptional()
  isEmergency?: boolean;
}