import { DynamicModule, Module } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { DatabaseService } from './database.service';

export const DATABASE_SERVICE = 'DATABASE_SERVICE';

@Module({
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {
  static forRoot(): DynamicModule {
    return {
      module: DatabaseModule,
    };
  }
  // Register repositories
  static forFeature(entities: ClassConstructor<any>[]): DynamicModule {
    const providers = entities.map((entity) => {
      return {
        provide: `${entity.name.toUpperCase()}_REPOSITORY`,
        useFactory: (dbService: DatabaseService) => dbService.getRepository(entity),
        inject: [DatabaseService],
      };
    });
    return {
      module: DatabaseModule,
      providers,
      exports: providers,
    };
  }
}
