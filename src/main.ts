import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { Role } from './role/role.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  
  app.enableCors({
    origin: true, 
    credentials: true,
  });

  
  const ds = app.get(DataSource);
  const roleRepo = ds.getRepository(Role);

  const roles = ['ADMIN', 'USER'];
  for (const name of roles) {
    const exists = await roleRepo.findOne({ where: { name } as any });
    if (!exists) {
      await roleRepo.save(roleRepo.create({ name } as any));
    }
  }

  
  const port = Number(process.env.PORT) || 3002;
  await app.listen(port);

  console.log(`Server running on port ${port}`);
}

bootstrap();
