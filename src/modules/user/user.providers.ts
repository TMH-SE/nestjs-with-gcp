import { DATABASE_SERVICE } from 'src/shared/modules/database/database.module';
import { DatabaseService } from 'src/shared/modules/database/database.service';
import { User } from './entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export const userProviders = [
  {
    provide: USER_REPOSITORY,
    useFactory: (dbService: DatabaseService) => dbService.getRepository(User),
    inject: [DATABASE_SERVICE],
  },
];
