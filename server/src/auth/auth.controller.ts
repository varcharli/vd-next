// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Request,Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }


  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Request() req) {
    const userId = req.user.userId; 
    return this.authService.me(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Request() req, @Body() body) {
    const userId = req.user.userId;
    return this.authService.changePassword(userId,body.oldPassword,body.newPassword);
  }
}