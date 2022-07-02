import { Inject } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';

export function InjectRepository(entity: ClassConstructor<any>) {
  return Inject(`${entity.name.toUpperCase()}_REPOSITORY`);
}
