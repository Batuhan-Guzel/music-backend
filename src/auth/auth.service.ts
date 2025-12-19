import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepo: Repository<Role>,

    private readonly jwtService: JwtService,
  ) {}

  
  async register(email: string, password: string) {
    
    const existing = await this.userRepo.findOne({ where: { email } });
    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    let adminRole = await this.roleRepo.findOne({ where: { name: 'ADMIN' } });
    if (!adminRole) {
      adminRole = await this.roleRepo.save(
        this.roleRepo.create({ name: 'ADMIN' }),
      );
    }

    let userRole = await this.roleRepo.findOne({ where: { name: 'USER' } });
    if (!userRole) {
      userRole = await this.roleRepo.save(
        this.roleRepo.create({ name: 'USER' }),
      );
    }

    
    const userCount = await this.userRepo.count();

    
    const roleToAssign = userCount === 0 ? adminRole : userRole;

    
    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role: roleToAssign,
    });

    await this.userRepo.save(user);

    return {
      message: 'Register successful',
      role: roleToAssign.name,
    };
  }

  
  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });

    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role.name,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
