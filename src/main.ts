import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Role } from './role/role.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  const ds = app.get(DataSource);
  const roleRepo = ds.getRepository(Role);

  const need = ['ADMIN', 'USER'];
  for (const name of need) {
    const exists = await roleRepo.findOne({ where: { name } as any });
    if (!exists) {
      await roleRepo.save(roleRepo.create({ name } as any));
    }
  }
  

  const port = process.env.PORT || 3002;
  await app.listen(port);
}
bootstrap();
