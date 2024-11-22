// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) { }

  async validateUser(name: string, pass: string): Promise<any> {
    // const user = await this.usersService.findOneByName(name);
    // if (user && await bcrypt.compare(pass, user.passwordHashed)) {
    //   const { passwordHashed, ...result } = user;
    //   return result;
    // }
    // return null;
    const user = await this.usersService.checkPasswordByUserName(name, pass);
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.name, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const payload = { username: user.name, sub: user.id, isAdmin: user.isAdmin };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async me(id: number) {
    return this.usersService.findById(id);
  }

  async changePassword(id: number, oldPassword: string, newPassword: string) {
    const user = await this.usersService.checkPassword(id, oldPassword);
    if (!user) return { ok: false };
    await this.usersService.changePassword(id, newPassword);
    return { ok: true };
  }

  async resetAdminPassword(newPassword: string, apiKey: string): Promise<boolean> {
    return this.usersService._resetAdminPassword(newPassword, apiKey);
  }
}