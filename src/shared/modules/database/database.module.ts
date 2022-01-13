import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

export const DATABASE_SERVICE = 'DATABASE_SERVICE';

@Module({
  providers: [
    {
      provide: DATABASE_SERVICE,
      useClass: DatabaseService,
    },
  ],
  exports: [DATABASE_SERVICE],
})
export class DatabaseModule {}
