import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    private readonly jwtService: JwtService,
  ) {}

  
  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (exists) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const userRole = await this.roleRepo.findOne({
      where: { name: 'USER' },
    });

    if (!userRole) {
      throw new BadRequestException("Role 'USER' not found");
    }

    const user = this.userRepo.create({
      email: dto.email,
      password: hashedPassword,
      role: userRole,
    });

    return this.userRepo.save(user);
  }

  
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(
      dto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role?.name,
    };

    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
