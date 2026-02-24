import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users') // Ojo: en la spec inicial dijimos /me, pero lo estándar es users/me o auth/me.
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('me')
  @ApiOperation({
    summary: 'Actualizar perfil (Onboarding: guardar problemas)',
  })
  updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    return this.usersService.update(req.user.userId, dto);
  }
}
