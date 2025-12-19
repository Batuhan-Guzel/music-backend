import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  create(data: Partial<User>) {
    return this.userRepo.save(data);
  }

  findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
      relations: ['role'],
    });
  }
}
