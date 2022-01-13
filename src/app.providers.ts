import { AppSeeder } from './seeder';

export const APP_SEEDER = 'APP_SEEDER';

export const appProviders = [
  {
    provide: APP_SEEDER,
    useClass: AppSeeder,
  },
];
