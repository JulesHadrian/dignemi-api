import { IsOptional, IsObject, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'Preferencias, problemas seleccionados, etc.', example: { issues: ['stress'] } })
  @IsObject()
  @IsOptional()
  profile?: any;

  @ApiProperty({ example: 'es-MX' })
  @IsOptional()
  locale?: string;
  
  @ApiProperty({ example: 'MX', description: 'Código ISO de 2 letras' })
  @IsString()
  @Length(2, 2)
  @IsOptional()
  country?: string;
}