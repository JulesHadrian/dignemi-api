import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrackEventDto {
  @ApiProperty({
    example: 'exercise_completed',
    description: 'Nombre del evento (snake_case recomendado)',
  })
  @IsString()
  @IsNotEmpty()
  event: string;

  @ApiProperty({
    example: { duration: 120, exerciseId: 'xyz' },
    description: 'Propiedades del evento',
  })
  @IsObject()
  @IsOptional()
  properties?: Record<string, any>;
}
