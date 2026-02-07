import { Controller, Post, Body, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

// DTO simple para validar el body
class LoginDto {
  @IsEmail()
  email: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Solicitar Magic Link' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.sendMagicLink(loginDto.email);
  }

  @Get('callback')
  @ApiOperation({ summary: 'Validar Magic Link (Click desde email)' })
  async callback(@Query('token') token: string) {
    return this.authService.validateMagicLink(token);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  getProfile(@Request() req) {
    return req.user; // Retorna { userId, email } decodificado del token
  }
}