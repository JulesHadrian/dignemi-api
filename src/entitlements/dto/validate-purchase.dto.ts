import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidatePurchaseDto {
  @ApiProperty({ description: 'Plataforma de la tienda', example: 'apple' })
  @IsString()
  @IsIn(['apple', 'google'])
  platform: string;

  @ApiProperty({ description: 'ID del producto comprado', example: 'premium_monthly' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ description: 'El recibo o token de compra (base64)', example: 'base64_receipt_string...' })
  @IsString()
  @IsNotEmpty()
  receipt: string;
}