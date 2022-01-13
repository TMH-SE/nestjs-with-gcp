import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppSeeder {
  constructor() {
    Logger.log('constructor');
  }

  async perform() {
    Logger.log(`\x1B[33m[${AppSeeder.name}]\x1B[0m Seeding successfully!`);
  }
}
