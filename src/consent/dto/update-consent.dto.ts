import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateConsentDto {
  @ApiProperty({
    description: 'Permitir recolección de métricas anónimas',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  analytics?: boolean;

  @ApiProperty({
    description: 'Permitir sincronización de datos en la nube',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  sync?: boolean;

  @ApiProperty({
    description: 'Versión de la política de privacidad aceptada',
    default: '1.0',
  })
  @IsString()
  @IsOptional()
  policyVersion?: string;
}
